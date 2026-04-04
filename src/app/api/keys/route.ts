import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateAPIKey } from '@/lib/auth/api-keys';

interface APIKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  allowed_domains: string[] | null;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, allowed_domains } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Validate allowed_domains if provided
    if (allowed_domains !== undefined && allowed_domains !== null) {
      if (!Array.isArray(allowed_domains)) {
        return NextResponse.json({ error: 'allowed_domains must be an array' }, { status: 400 });
      }
      if (!allowed_domains.every((d: unknown) => typeof d === 'string')) {
        return NextResponse.json({ error: 'allowed_domains must be an array of strings' }, { status: 400 });
      }
    }

    // Enforce per-plan API key limit (Gap 2)
    const admin = createAdminClient();
    const { data: subData } = await admin
      .from('subscriptions')
      .select('subscription_plans(api_keys_limit)')
      .eq('user_id', user.id)
      .maybeSingle();
    const planLimit = (subData?.subscription_plans as unknown as { api_keys_limit: number | null } | null)?.api_keys_limit ?? 1;

    if (planLimit !== -1) {
      const { count } = await admin
        .from('api_keys')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if ((count ?? 0) >= planLimit) {
        return NextResponse.json(
          { error: `Your plan allows a maximum of ${planLimit} API key${planLimit === 1 ? '' : 's'}. Delete an existing key or upgrade your plan.` },
          { status: 403 }
        );
      }
    }

    const { key, keyPrefix, keyHash } = generateAPIKey();

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        scopes: ['read', 'write', 'generate'],
        allowed_domains: allowed_domains ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    const apiKey = data as APIKeyRow;

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key_prefix: apiKey.key_prefix,
      allowed_domains: apiKey.allowed_domains,
      plainKey: key,
      created_at: apiKey.created_at,
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, allowed_domains, last_used_at, expires_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error listing API keys:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

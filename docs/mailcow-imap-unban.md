# MailCow IMAP Unban & Whitelist

Server IP to unban: `103.81.127.86`

## 1. Check current bans

```bash
cd /opt/mailcow-dockerized

# Check netfilter logs for our IP
docker compose logs netfilter-mailcow --tail=200 | grep "103.81.127.86"

# Check Dovecot logs
docker compose logs dovecot-mailcow --tail=200 | grep "103.81.127.86"

# Check Redis ban lists
docker compose exec redis-mailcow redis-cli keys "F2B_*"
docker compose exec redis-mailcow redis-cli smembers "F2B_ACTIVE_BANS"
docker compose exec redis-mailcow redis-cli smembers "F2B_PERM_BANS"
```

## 2. Unban the IP

```bash
cd /opt/mailcow-dockerized

# Remove from iptables
docker compose exec netfilter-mailcow sh -c "iptables -D MAILCOW -s 103.81.127.86 -j REJECT" 2>/dev/null
docker compose exec netfilter-mailcow sh -c "iptables -D MAILCOW -s 103.81.127.86 -j DROP" 2>/dev/null

# Remove from Redis ban lists
docker compose exec redis-mailcow redis-cli srem "F2B_ACTIVE_BANS" "103.81.127.86"
docker compose exec redis-mailcow redis-cli srem "F2B_PERM_BANS" "103.81.127.86"
docker compose exec redis-mailcow redis-cli del "F2B_QUEUE_UNIQ:103.81.127.86"
```

## 3. Whitelist the IP to prevent future bans

```bash
cd /opt/mailcow-dockerized

# Check current whitelist
grep NETFILTER mailcow.conf

# Add the IP to the whitelist
sed -i 's/^MAILCOW_NETFILTER_WHITELIST=.*/&,103.81.127.86\/32/' mailcow.conf
# OR if the variable is empty/unset:
# echo 'MAILCOW_NETFILTER_WHITELIST=103.81.127.86/32' >> mailcow.conf

# Restart netfilter to apply
docker compose restart netfilter-mailcow
```

## 4. Verify

```bash
# Check the IP is no longer banned
docker compose exec netfilter-mailcow sh -c "iptables -L MAILCOW -n" | grep "103.81.127.86"
# (should return nothing)

# Check whitelist applied
docker compose exec netfilter-mailcow sh -c "iptables -L MAILCOW -n" | head -20
```

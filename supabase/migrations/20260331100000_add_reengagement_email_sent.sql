alter table profiles
  add column if not exists reengagement_email_sent boolean not null default false;

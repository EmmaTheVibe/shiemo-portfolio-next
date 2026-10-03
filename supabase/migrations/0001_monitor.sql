create extension if not exists pgcrypto;

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text,
  url text not null unique,
  title text not null,
  company text,
  location text,
  remote boolean,
  description text,
  tags text[] not null default '{}',
  posted_at timestamptz,
  discovered_at timestamptz not null default now(),
  score int,
  score_reason text,
  status text not null default 'new'
    check (status in ('new','matched','skipped','drafted','approved','sent','replied','rejected'))
);
create index if not exists jobs_status_idx on jobs (status, discovered_at desc);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  to_email text,
  subject text,
  body text,
  status text not null default 'draft'
    check (status in ('draft','approved','sent','failed','rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists emails_sent (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete set null,
  to_email text not null,
  subject text not null,
  provider_id text,
  sent_at timestamptz not null default now(),
  replied_at timestamptz
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  ok boolean,
  found int not null default 0,
  inserted int not null default 0,
  errors jsonb not null default '[]'
);

-- Server-only access via the service-role key. RLS on with no policies
-- blocks the public anon/publishable key entirely.
alter table jobs enable row level security;
alter table applications enable row level security;
alter table emails_sent enable row level security;
alter table runs enable row level security;

-- HIPAA affiliate program — prefixed to avoid collision with existing legacy
-- affiliate_* tables on the shared marketplace/website Supabase project.

create extension if not exists "pgcrypto";

create table if not exists public.hipaa_affiliates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  email text not null,
  first_name text,
  last_name text,
  company text,
  linkedin_url text,
  referral_source text,
  crm_contact_id text,
  location_id text not null default '6MSqx0trfxgLxeHBJE1k',
  status text not null default 'active',
  payout_method text,
  payout_email text,
  payout_details jsonb,
  commission_rate numeric not null default 0.30,
  total_clicks integer not null default 0,
  total_conversions integer not null default 0,
  total_earned_cents integer not null default 0,
  total_paid_cents integer not null default 0,
  accepted_terms_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hipaa_affiliates_email_idx on public.hipaa_affiliates (lower(email));
create index if not exists hipaa_affiliates_slug_idx on public.hipaa_affiliates (slug);

create table if not exists public.hipaa_affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.hipaa_affiliates(id) on delete cascade,
  slug text not null,
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  user_agent text,
  converted boolean not null default false,
  order_id text,
  order_amount_cents integer,
  commission_cents integer,
  created_at timestamptz not null default now()
);

create index if not exists hipaa_affiliate_clicks_slug_idx on public.hipaa_affiliate_clicks (slug);
create index if not exists hipaa_affiliate_clicks_affiliate_idx on public.hipaa_affiliate_clicks (affiliate_id);
create index if not exists hipaa_affiliate_clicks_converted_idx on public.hipaa_affiliate_clicks (converted) where converted = true;

create table if not exists public.hipaa_affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.hipaa_affiliates(id) on delete cascade,
  amount_cents integer not null,
  status text not null default 'pending',
  period_start date,
  period_end date,
  paid_at timestamptz,
  method text,
  reference text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists hipaa_affiliate_payouts_affiliate_idx on public.hipaa_affiliate_payouts (affiliate_id);

alter table public.hipaa_affiliates enable row level security;
alter table public.hipaa_affiliate_clicks enable row level security;
alter table public.hipaa_affiliate_payouts enable row level security;

drop policy if exists "hipaa_affiliate_clicks_public_insert" on public.hipaa_affiliate_clicks;
create policy "hipaa_affiliate_clicks_public_insert"
  on public.hipaa_affiliate_clicks for insert to anon, authenticated
  with check (true);

create or replace function public.touch_hipaa_affiliates_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists hipaa_affiliates_touch_updated on public.hipaa_affiliates;
create trigger hipaa_affiliates_touch_updated
  before update on public.hipaa_affiliates
  for each row execute function public.touch_hipaa_affiliates_updated_at();

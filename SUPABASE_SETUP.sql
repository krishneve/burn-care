-- ═══════════════════════════════════════════════════════════
-- DRIP-RATE ASSISTANT — SUPABASE SETUP
-- ═══════════════════════════════════════════════════════════
-- HOW TO USE:
--   1. Go to https://supabase.com → your project
--   2. Left sidebar → SQL Editor → "+ New query"
--   3. Paste this ENTIRE file → click RUN (▶)
--   4. After it succeeds, go to Table Editor → you'll see
--      three tables: patients, urine_logs, fluid_logs
--   5. Open src/lib/supabase.js and fill in:
--        SUPABASE_URL      → Settings → API → Project URL
--        SUPABASE_ANON_KEY → Settings → API → anon / public key
-- ═══════════════════════════════════════════════════════════

-- 1. PATIENTS TABLE
create table if not exists patients (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  age              integer,
  weight           numeric not null,
  burn_time        timestamptz not null,
  burn_type        text default 'thermal',
  patient_type     text default 'adult',
  tbsa             numeric default 0,
  selected_regions jsonb default '[]',
  total_fluid      numeric default 0,
  first_8h         numeric default 0,
  next_16h         numeric default 0,
  drip_rate        numeric default 0,
  hourly_rate      numeric default 0,
  drop_factor      integer default 15,
  status           text default 'active',
  ward             text,
  bed_number       text,
  _alert           boolean default false,
  _alert_time      timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 2. URINE LOGS TABLE
create table if not exists urine_logs (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid references patients(id) on delete cascade,
  volume_ml   numeric not null,
  logged_at   timestamptz default now(),
  logged_by   text,
  notes       text
);

-- 3. FLUID LOGS TABLE
create table if not exists fluid_logs (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid references patients(id) on delete cascade,
  volume_ml   numeric not null,
  rate_ml_hr  numeric,
  logged_at   timestamptz default now(),
  notes       text
);

-- 4. ROW LEVEL SECURITY
--    (open access for now — add user auth policies later)
alter table patients   enable row level security;
alter table urine_logs enable row level security;
alter table fluid_logs enable row level security;

create policy "Allow all" on patients
  for all using (true) with check (true);

create policy "Allow all" on urine_logs
  for all using (true) with check (true);

create policy "Allow all" on fluid_logs
  for all using (true) with check (true);

-- 5. REALTIME SYNC
--    Lets multiple devices see updates instantly
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table urine_logs;

-- ═══════════════════════════════════════════════════════════
-- DONE! Check Table Editor in the left sidebar.
-- You should see: patients / urine_logs / fluid_logs
-- ═══════════════════════════════════════════════════════════

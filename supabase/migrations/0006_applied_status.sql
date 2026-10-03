-- Simplify: a job is either not applied ("new") or "applied".
-- Matched / skipped are derived from the score, not stored as a status.
alter table jobs drop constraint if exists jobs_status_check;

update jobs set status = 'new'
where status in ('matched', 'skipped', 'drafted', 'approved', 'sent', 'replied', 'rejected');

alter table jobs add constraint jobs_status_check check (status in ('new', 'applied'));

alter table jobs add column if not exists applied_at timestamptz;

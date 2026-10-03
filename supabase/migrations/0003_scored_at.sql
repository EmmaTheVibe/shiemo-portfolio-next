alter table jobs add column if not exists scored_at timestamptz;

-- Rows scored before this column existed count as scored when discovered.
update jobs set scored_at = discovered_at where score is not null and scored_at is null;

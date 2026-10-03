-- One application per job.
create unique index if not exists applications_job_id_key on applications (job_id);

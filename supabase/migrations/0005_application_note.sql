-- Shows send errors / test-send confirmations next to a draft.
alter table applications add column if not exists note text;

ALTER TABLE sample
ADD COLUMN elevation numeric;
ALTER TABLE sample
ADD COLUMN lab_name text;
ALTER TABLE sample
ADD COLUMN lab_standard text;
ALTER TABLE sample
ADD COLUMN lab_date timestamp;
ALTER TABLE sample
ADD COLUMN thickness numeric;
ALTER TABLE sample
ADD COLUMN boulder_height numeric;
ALTER TABLE sample
ADD COLUMN atm_pressure numeric;

ALTER TABLE analysis
ADD COLUMN standard_id text;

ALTER TABLE datum
ADD COLUMN interror numeric;

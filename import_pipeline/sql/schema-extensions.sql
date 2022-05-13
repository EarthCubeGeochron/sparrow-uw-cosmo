ALTER TABLE sample
ADD COLUMN elevation numeric;
ALTER TABLE sample
ADD COLUMN lab_name text;
ALTER TABLE sample
ADD COLUMN ams_standard text;
ALTER TABLE sample
ADD COLUMN lab_date timestamp;
ALTER TABLE sample
ADD COLUMN thickness numeric;
ALTER TABLE sample
ADD COLUMN boulder_height numeric;
ALTER TABLE sample
ADD COLUMN atm_pressure numeric;
ALTER TABLE sample
ADD COLUMN pressure_flag text;
ALTER TABLE sample
ADD COLUMN compile text;
ALTER TABLE sample
ADD COLUMN reference text;
ALTER TABLE sample
ADD COLUMN mineral_type text;

ALTER TABLE sample
ADD COLUMN ice_d_id numeric;


ALTER TABLE analysis
ADD COLUMN standard_id text;

ALTER TABLE datum
ADD COLUMN interror numeric;

/* ice-d */

-- CREATE TABLE iceD (
--   sample_name text,
--   lat numeric,
--   lon numeric,
--   elevation numeric,
--   shielding numeric,
--   thickness numeric,
--   density numeric,
--   boulder_height numeric,
--   lithology text,
--   material_type text,
--   mineral text,
--   data_collected timestamp,
--   labe_date timestamp,
--   ams_standard text,
--   pressure_flag text,
--   reference text
-- )

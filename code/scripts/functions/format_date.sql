CREATE OR REPLACE FUNCTION private.format_date(d DATE)
RETURNS TEXT AS $$
BEGIN
    RETURN TO_CHAR(d, 'Mon ') ||
           EXTRACT(DAY FROM d) ||
           CASE
               WHEN EXTRACT(DAY FROM d) IN (11,12,13) THEN 'th'
               WHEN EXTRACT(DAY FROM d) % 10 = 1 THEN 'st'
               WHEN EXTRACT(DAY FROM d) % 10 = 2 THEN 'nd'
               WHEN EXTRACT(DAY FROM d) % 10 = 3 THEN 'rd'
               ELSE 'th'
           END
           || ', ' || TO_CHAR(d, 'YYYY');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

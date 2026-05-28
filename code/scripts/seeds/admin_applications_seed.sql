BEGIN;

DO $$
DECLARE
  v_admin_id CONSTANT uuid := '47c04272-248c-4469-8c6c-48ed0fa91709';
  v_admin_role private.user_role;
BEGIN
  SELECT role
  INTO v_admin_role
  FROM private.users
  WHERE id = v_admin_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin user % does not exist in private.users.', v_admin_id;
  END IF;

  IF v_admin_role <> 'admin' THEN
    RAISE EXCEPTION 'User % exists but is not an admin. Found role: %', v_admin_id, v_admin_role;
  END IF;
END $$;

CREATE TEMP TABLE tmp_admin_app_seed (
  project_title text PRIMARY KEY,
  ip_title text,
  ip_type private.iprtype,
  funding_source text,
  filing_date date,
  registration_date date,
  created_at timestamptz,
  ip_number text,
  is_withdrawn boolean,
  desired_status_type varchar(50)
) ON COMMIT DROP;

INSERT INTO tmp_admin_app_seed (
  project_title,
  ip_title,
  ip_type,
  funding_source,
  filing_date,
  registration_date,
  created_at,
  ip_number,
  is_withdrawn,
  desired_status_type
) VALUES
  (
    'IRIS Demo Patent - Seaweed Drying Chamber',
    'Modular thermal drying chamber for seaweed post-harvest processing',
    'patent',
    'DOST-PCAARRD',
    '2021-03-20',
    '2021-10-15',
    '2021-01-12 08:00:00+00',
    'PAT-2021-001',
    false,
    'registered'
  ),
  (
    'IRIS Demo Utility Model - Fish Crate Aerator',
    'Portable low-power aeration assembly for fish transport crates',
    'utility_model',
    'BFAR',
    '2021-08-12',
    NULL,
    '2021-05-03 08:00:00+00',
    'UM-2021-014',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Industrial Design - Bottle Label Sleeve',
    'Packaging sleeve design for regionally branded marine nutraceutical products',
    'industrial_design',
    'UPV In-house Budget',
    NULL,
    NULL,
    '2022-02-10 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Trademark - Blue Current',
    'Blue Current',
    'trademark',
    'Not applicable',
    '2022-04-28',
    '2022-11-22',
    '2022-02-18 08:00:00+00',
    'TM-2022-009',
    false,
    'registered'
  ),
  (
    'IRIS Demo Copyright - ReefLearn Modules',
    'ReefLearn multimedia training modules',
    'copyright',
    'UP System',
    NULL,
    NULL,
    '2023-04-05 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Patent - Mangrove Sensor Network',
    'Distributed salinity and flood sensor network for mangrove restoration sites',
    'patent',
    'DOST-PCIEERRD',
    '2023-09-01',
    NULL,
    '2023-06-21 08:00:00+00',
    'PAT-2023-017',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Utility Model - Ice Box Partition',
    'Interlocking insulated partition system for community landing-site ice boxes',
    'utility_model',
    'DA',
    '2024-03-19',
    '2024-10-12',
    '2024-01-08 08:00:00+00',
    'UM-2024-004',
    false,
    'registered'
  ),
  (
    'IRIS Demo Industrial Design - Smart Buoy Housing',
    'Exterior housing design for a coastal monitoring smart buoy',
    'industrial_design',
    'Others',
    NULL,
    NULL,
    '2024-06-18 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Trademark - Isla Harvest',
    'Isla Harvest',
    'trademark',
    'Not applicable',
    '2025-03-14',
    NULL,
    '2025-01-27 08:00:00+00',
    'TM-2025-006',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Copyright - AquaLedger',
    'AquaLedger records management web application',
    'copyright',
    'DOST-TAPI',
    '2025-05-10',
    '2025-12-02',
    '2025-02-11 08:00:00+00',
    'CR-2025-011',
    false,
    'registered'
  ),
  (
    'IRIS Demo Patent - Shell Waste Composite Board',
    'Composite board formulation using shell waste and agricultural fibers',
    'patent',
    'DOST-PCHRD',
    NULL,
    NULL,
    '2025-07-09 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Trademark - Habagat Labs',
    'Habagat Labs',
    'trademark',
    'Not applicable',
    '2026-05-05',
    NULL,
    '2026-05-28 09:00:00+00',
    'TM-2026-003',
    true,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Patent - Coconut Fiber Filter Mesh',
    'Layered coconut fiber mesh for low-cost filtration systems',
    'patent',
    'DOST-TAPI',
    NULL,
    NULL,
    '2026-05-22 08:30:00+00',
    NULL,
    false,
    'downgraded_to_um'
  ),
  (
    'IRIS Demo Copyright - Baybayin Reef Atlas',
    'Baybayin Reef Atlas digital publication and media set',
    'copyright',
    'UPV In-house Budget',
    '2026-05-26',
    NULL,
    '2026-05-26 10:00:00+00',
    'CR-2026-002',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Utility Model - Solar Brine Pump',
    'Solar-assisted compact pump for coastal brine transfer',
    'utility_model',
    'UP System',
    NULL,
    NULL,
    '2026-05-28 11:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Patent - Algae Feed Extruder',
    'Twin-screw extruder for algae-enriched aquafeed pellets',
    'patent',
    'DOST-PCAARRD',
    '2021-11-03',
    NULL,
    '2021-07-15 08:00:00+00',
    'PAT-2021-018',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Patent - Oyster Grading Conveyor',
    'Semi-automated conveyor system for oyster size grading',
    'patent',
    'BFAR',
    NULL,
    NULL,
    '2022-09-09 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Trademark - TideCraft',
    'TideCraft',
    'trademark',
    'Not applicable',
    '2023-02-17',
    NULL,
    '2022-12-14 08:00:00+00',
    'TM-2023-002',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Copyright - Fisherfolk Field Notes',
    'Fisherfolk Field Notes mobile learning content',
    'copyright',
    'UP System',
    '2023-08-25',
    NULL,
    '2023-07-02 08:00:00+00',
    'CR-2023-015',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Utility Model - Net Repair Jig',
    'Bench-mounted jig for small-scale fishing net repair',
    'utility_model',
    'DA',
    NULL,
    NULL,
    '2023-11-09 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Patent - Brackish Water Sampler',
    'Automated composite sampler for brackish water monitoring',
    'patent',
    'DOST-PCIEERRD',
    '2024-08-14',
    NULL,
    '2024-04-12 08:00:00+00',
    'PAT-2024-010',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Trademark - Sulu Bloom',
    'Sulu Bloom',
    'trademark',
    'Not applicable',
    NULL,
    NULL,
    '2024-09-20 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Industrial Design - Hatchery Control Panel',
    'Faceplate and enclosure design for hatchery control systems',
    'industrial_design',
    'Others',
    '2025-04-21',
    NULL,
    '2025-03-01 08:00:00+00',
    'ID-2025-003',
    false,
    'filed_with_ipophil'
  ),
  (
    'IRIS Demo Copyright - Coastal Data Storyboard',
    'Interactive storyboard for coastal resilience datasets',
    'copyright',
    'UPV In-house Budget',
    NULL,
    NULL,
    '2025-10-16 08:00:00+00',
    NULL,
    false,
    'draft_idf'
  ),
  (
    'IRIS Demo Trademark - Amihan Works',
    'Amihan Works',
    'trademark',
    'Not applicable',
    '2026-03-08',
    '2026-05-18',
    '2026-02-03 08:00:00+00',
    'TM-2026-001',
    false,
    'registered'
  ),
  (
    'IRIS Demo Patent - Biofloc Sensor Wand',
    'Handheld sensor wand for rapid biofloc pond readings',
    'patent',
    'DOST-PCHRD',
    NULL,
    NULL,
    '2026-05-27 13:00:00+00',
    NULL,
    false,
    'draft_idf'
  );

INSERT INTO private.ipr_applications (
  ip_title,
  project_title,
  ip_type,
  funding_source,
  filing_date,
  registration_date,
  created_by,
  ip_number,
  is_withdrawn,
  created_at,
  updated_at
)
SELECT
  seed.ip_title,
  seed.project_title,
  seed.ip_type,
  seed.funding_source,
  seed.filing_date,
  seed.registration_date,
  '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid,
  seed.ip_number,
  seed.is_withdrawn,
  seed.created_at,
  seed.created_at
FROM tmp_admin_app_seed AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM private.ipr_applications AS existing
  WHERE existing.project_title = seed.project_title
    AND existing.created_by = '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid
);

UPDATE private.ipr_applications AS apps
SET
  ip_title = seed.ip_title,
  ip_type = seed.ip_type,
  funding_source = seed.funding_source,
  filing_date = seed.filing_date,
  registration_date = seed.registration_date,
  ip_number = seed.ip_number,
  is_withdrawn = seed.is_withdrawn,
  created_at = seed.created_at
FROM tmp_admin_app_seed AS seed
WHERE apps.project_title = seed.project_title
  AND apps.created_by = '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid;

CREATE TEMP TABLE tmp_admin_inventor_seed (
  project_title text,
  techgen_id uuid,
  full_name text,
  email text,
  college_code varchar(20),
  other_college_name text,
  external_institution text,
  comments text,
  status private.inventorstatustype
) ON COMMIT DROP;

INSERT INTO tmp_admin_inventor_seed (
  project_title,
  techgen_id,
  full_name,
  email,
  college_code,
  other_college_name,
  external_institution,
  comments,
  status
) VALUES
  (
    'IRIS Demo Patent - Seaweed Drying Chamber',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Seaweed Drying Chamber',
    NULL,
    'Marina L. Torres',
    'marina.torres@example.com',
    'CFOS',
    NULL,
    NULL,
    'Lead inventor seeded by admin.',
    'non-member'
  ),
  (
    'IRIS Demo Patent - Seaweed Drying Chamber',
    NULL,
    'Paolo R. Sarmiento',
    'paolo.sarmiento@example.com',
    'SoTech-FT',
    NULL,
    NULL,
    'Co-inventor seeded by admin.',
    'non-member'
  ),
  (
    'IRIS Demo Utility Model - Fish Crate Aerator',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Utility Model - Fish Crate Aerator',
    NULL,
    'Liza M. Rojas',
    'liza.rojas@example.com',
    'CFOS-IMFO',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Industrial Design - Bottle Label Sleeve',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Industrial Design - Bottle Label Sleeve',
    NULL,
    'Anton D. Velasco',
    'anton.velasco@example.com',
    'CAS',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - Blue Current',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - Blue Current',
    NULL,
    'Julia M. Vergara',
    'julia.vergara@example.com',
    'TTBDO',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Copyright - ReefLearn Modules',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Copyright - ReefLearn Modules',
    NULL,
    'Hazel P. Domingo',
    'hazel.domingo@example.com',
    'UPVGS',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Mangrove Sensor Network',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Mangrove Sensor Network',
    NULL,
    'Miguel A. Cabrera',
    'miguel.cabrera@example.com',
    NULL,
    NULL,
    'Western Visayas Coastal Innovation Lab',
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Utility Model - Ice Box Partition',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Utility Model - Ice Box Partition',
    NULL,
    'Rhea C. Alonzo',
    'rhea.alonzo@example.com',
    'CFOS-IFPT',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Industrial Design - Smart Buoy Housing',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Industrial Design - Smart Buoy Housing',
    NULL,
    'Patrick E. Flores',
    'patrick.flores@example.com',
    'SoTech-ChE',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - Isla Harvest',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - Isla Harvest',
    NULL,
    'Nina B. Celis',
    'nina.celis@example.com',
    NULL,
    'College of Sustainable Enterprise',
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Copyright - AquaLedger',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Copyright - AquaLedger',
    NULL,
    'Carlo V. Dela Cruz',
    'carlo.delacruz@example.com',
    'CAS-DPSM',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Shell Waste Composite Board',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Shell Waste Composite Board',
    NULL,
    'Eunice T. Mercado',
    'eunice.mercado@example.com',
    'NIMBB',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - Habagat Labs',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - Habagat Labs',
    NULL,
    'Ramon K. Ilagan',
    'ramon.ilagan@example.com',
    'RRC',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Coconut Fiber Filter Mesh',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Coconut Fiber Filter Mesh',
    NULL,
    'Teresa Y. Lapuz',
    'teresa.lapuz@example.com',
    'SoTech',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Copyright - Baybayin Reef Atlas',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Copyright - Baybayin Reef Atlas',
    NULL,
    'Omar S. Dizon',
    'omar.dizon@example.com',
    'CAS-Bio',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Utility Model - Solar Brine Pump',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Utility Model - Solar Brine Pump',
    NULL,
    'Faye C. Mariano',
    'faye.mariano@example.com',
    'CFOS-IA',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Algae Feed Extruder',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Algae Feed Extruder',
    NULL,
    'Gerard P. Hilado',
    'gerard.hilado@example.com',
    'CFOS-IA',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Oyster Grading Conveyor',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Oyster Grading Conveyor',
    NULL,
    'Melissa J. Tiongson',
    'melissa.tiongson@example.com',
    'SoTech-ChE',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - TideCraft',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - TideCraft',
    NULL,
    'Sheena D. Golez',
    'sheena.golez@example.com',
    'TTBDO',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Copyright - Fisherfolk Field Notes',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Copyright - Fisherfolk Field Notes',
    NULL,
    'Noel A. Santillan',
    'noel.santillan@example.com',
    'UPVGS',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Utility Model - Net Repair Jig',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Utility Model - Net Repair Jig',
    NULL,
    'April K. Legaspi',
    'april.legaspi@example.com',
    'CFOS',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Brackish Water Sampler',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Brackish Water Sampler',
    NULL,
    'Cyrus N. Mapa',
    'cyrus.mapa@example.com',
    NULL,
    NULL,
    'West Visayas Applied Marine Systems Lab',
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - Sulu Bloom',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - Sulu Bloom',
    NULL,
    'Patricia O. Sumagaysay',
    'patricia.sumagaysay@example.com',
    NULL,
    'School of Enterprise and Design',
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Industrial Design - Hatchery Control Panel',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Industrial Design - Hatchery Control Panel',
    NULL,
    'Daryl V. Navarra',
    'daryl.navarra@example.com',
    'SoTech',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Copyright - Coastal Data Storyboard',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Copyright - Coastal Data Storyboard',
    NULL,
    'Leah B. Ramos',
    'leah.ramos@example.com',
    'CAS-DPSM',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Trademark - Amihan Works',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Trademark - Amihan Works',
    NULL,
    'Katrina E. Dacillo',
    'katrina.dacillo@example.com',
    'RRC',
    NULL,
    NULL,
    NULL,
    'non-member'
  ),
  (
    'IRIS Demo Patent - Biofloc Sensor Wand',
    'dc092400-7db2-44cf-b5f8-e210806817f6'::uuid,
    'jrolana',
    'jrolana@up.edu.ph',
    NULL,
    'Unspecified',
    NULL,
    'Linked techgen visible on all seeded applications.',
    'member'
  ),
  (
    'IRIS Demo Patent - Biofloc Sensor Wand',
    NULL,
    'Victor S. Guevarra',
    'victor.guevarra@example.com',
    'NIMBB',
    NULL,
    NULL,
    NULL,
    'non-member'
  );

INSERT INTO private.inventors (
  application_id,
  techgen_id,
  full_name,
  email,
  college_code,
  other_college_name,
  external_institution,
  comments,
  status
)
SELECT
  apps.id,
  seed.techgen_id,
  seed.full_name,
  seed.email,
  seed.college_code,
  seed.other_college_name,
  seed.external_institution,
  seed.comments,
  seed.status
FROM tmp_admin_inventor_seed AS seed
INNER JOIN private.ipr_applications AS apps
  ON apps.project_title = seed.project_title
 AND apps.created_by = '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid
ON CONFLICT (application_id, email) DO NOTHING;

INSERT INTO private.ipr_statuses (
  application_id,
  status_type,
  created_at
)
SELECT
  apps.id,
  seed.desired_status_type,
  seed.created_at + interval '12 hours'
FROM tmp_admin_app_seed AS seed
INNER JOIN private.ipr_applications AS apps
  ON apps.project_title = seed.project_title
 AND apps.created_by = '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid
WHERE seed.desired_status_type NOT IN ('draft_classification', 'draft_idf')
  AND NOT EXISTS (
    SELECT 1
    FROM private.ipr_statuses AS statuses
    WHERE statuses.application_id = apps.id
      AND statuses.status_type = seed.desired_status_type
  );

UPDATE private.ipr_applications AS apps
SET curr_status = (
  SELECT statuses.id
  FROM private.ipr_statuses AS statuses
  WHERE statuses.application_id = apps.id
    AND statuses.status_type = seed.desired_status_type
  ORDER BY statuses.created_at DESC, statuses.id DESC
  LIMIT 1
)
FROM tmp_admin_app_seed AS seed
WHERE apps.project_title = seed.project_title
  AND apps.created_by = '47c04272-248c-4469-8c6c-48ed0fa91709'::uuid;

COMMIT;

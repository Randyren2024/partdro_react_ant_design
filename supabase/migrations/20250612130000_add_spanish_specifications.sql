-- ============================================================================
-- Migration: Add Spanish translations for product specifications
-- Description: This migration adds Spanish translations for all product specifications
-- to demonstrate the internationalization functionality
-- IMPORTANT: Run AFTER the multilingual columns have been created!
-- ============================================================================

-- Check if specifications_i18n column exists before proceeding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'specifications_i18n'
    ) THEN
        RAISE EXCEPTION 'specifications_i18n column does not exist. Please run the multilingual support migration first.';
    END IF;
END $$;

-- Update AgriDrone Pro X1 specifications with Spanish translations
UPDATE products 
SET specifications_i18n = jsonb_set(
    specifications_i18n,
    '{es}',
    '{
        "flight_time": "45 minutos",
        "max_payload": "10 kg",
        "operating_range": "15 km",
        "camera_resolution": "4K HDR",
        "gps_accuracy": "RTK ±2cm",
        "weather_rating": "IP54",
        "operating_temperature": "-10°C a 45°C",
        "max_wind_speed": "12 m/s",
        "charging_time": "90 minutos",
        "weight": "8.5 kg",
        "sensors": ["Multiespectral", "Térmico", "RGB", "NDVI"],
        "spray_system": "Sistema de boquillas de precisión",
        "tank_capacity": "10 litros"
    }'::jsonb
)
WHERE name = 'AgriDrone Pro X1';

-- Update SurveyDrone Mapper Pro specifications with Spanish translations
UPDATE products 
SET specifications_i18n = jsonb_set(
    specifications_i18n,
    '{es}',
    '{
        "flight_time": "55 minutos",
        "accuracy": "RTK ±2cm",
        "camera": "RGB de grado topográfico 42MP",
        "lidar": "Nube de puntos de alta densidad 300,000 pts/seg",
        "range": "20 km",
        "weather_rating": "IP65",
        "operating_altitude": "Hasta 4000m",
        "data_storage": "SSD 1TB",
        "processing_unit": "NVIDIA Jetson Xavier",
        "weight": "12.3 kg"
    }'::jsonb
)
WHERE name = 'SurveyDrone Mapper Pro';

-- Update RescueDrone Emergency Response specifications with Spanish translations
UPDATE products 
SET specifications_i18n = jsonb_set(
    specifications_i18n,
    '{es}',
    '{
        "flight_time": "40 minutos",
        "thermal_camera": "FLIR 640x512",
        "optical_zoom": "30x",
        "weather_rating": "IP67",
        "operating_temp": "-20°C a 50°C",
        "night_vision": "Espectro completo",
        "communication": "Radio encriptada",
        "emergency_beacon": "Señal de socorro GPS",
        "weight": "6.8 kg",
        "max_altitude": "6000m"
    }'::jsonb
)
WHERE name = 'RescueDrone Emergency Response';

-- Update IndustrialBot Alpha Manufacturing specifications with Spanish translations
UPDATE products 
SET specifications_i18n = jsonb_set(
    specifications_i18n,
    '{es}',
    '{
        "payload": "50 kg",
        "reach": "2.5 metros",
        "accuracy": "±0.1 mm",
        "power": "3.2 kW",
        "controller": "PLC avanzado con IA",
        "axes": "Articulado de 6 ejes",
        "cycle_time": "3.2 segundos",
        "operating_temp": "0°C a 45°C",
        "safety_rating": "Categoría 3 PLd",
        "weight": "180 kg"
    }'::jsonb
)
WHERE name = 'IndustrialBot Alpha Manufacturing';

-- Update CleanBot Pro Commercial specifications with Spanish translations
UPDATE products 
SET specifications_i18n = jsonb_set(
    specifications_i18n,
    '{es}',
    '{
        "battery_life": "4 horas continuas",
        "coverage": "500 m²/hora",
        "navigation": "SLAM + Visión por Computadora",
        "cleaning_modes": ["Aspirar", "Trapear", "Fregar", "Pulir"],
        "water_tank": "2 litros",
        "dust_capacity": "1.5 litros",
        "sensors": "LiDAR 360° + cámaras",
        "connectivity": "WiFi + 4G",
        "weight": "25 kg",
        "dimensions": "60x40x30 cm"
    }'::jsonb
)
WHERE name = 'CleanBot Pro Commercial';

-- Verify the Spanish translations were added
SELECT 
    name,
    specifications_i18n->'es' as spanish_specifications
FROM products 
WHERE specifications_i18n ? 'es'
LIMIT 3;

-- Success message
SELECT 'Spanish translations have been successfully added!' as status;
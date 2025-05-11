import json
import random
import datetime
import argparse
import os

REGIONS = {
    'temperature': ["North Pacific Gyre", "Gulf Stream", "Kuroshio Current", "Antarctic Circumpolar", "Equatorial Upwelling"],
    'salinity': ["Red Sea", "Mediterranean Basin", "Arctic Halocline", "Bay of Bengal", "Sargasso Sea"],
    'ph': ["Coastal Upwelling Zones", "Hydrothermal Vents", "Kelp Forests", "Estuaries", "Coral Reef Systems"],
    'dissolved_oxygen': ["Oxygen Minimum Zones (OMZs)", "Fjords and Inlets", "Deep Ocean Basins", "Productive Coastal Waters", "Seasonal Dead Zones"],
    'reef': ["Great Barrier Reef", "Mesoamerican Reef", "Coral Triangle Hotspots", "Hawaiian Islands Chain", "Maldives Atolls"],
    'turbidity': ["River Deltas", "Coastal Construction Zones", "Volcanic Ash Plume Areas", "Glacial Meltwater Outflows", "Estuarine Systems"],
    'chlorophyll': ["Spring Bloom Areas (North Atlantic)", "Coastal Upwelling Systems", "Equatorial Pacific Productive Zone", "Southern Ocean Phytoplankton Blooms", "Shelf Sea Fronts"],
    'wave_height': ["North Atlantic Storm Tracks", "Southern Ocean Roaring Forties", "Pacific Typhoon Paths", "Coastal Surf Zones", "Offshore Wind Farms"]
}

BUOY_NAMES = [
    "Ocean Observer {idx}", "SeaSentinel {idx}", "AquaMonitor {idx}", "HydroSphere Probe {idx}", "MarineTrack {idx}",
    "DeepWave {idx}", "CoastGuard {idx} Array", "AbyssalNode {idx}", "ReefWatch {idx}", "PelagicSensor {idx}"
]

PLATFORM_TYPES = [
    "REEFlect-Prime", "OceanSense-Core", "AquaDynamics-Pro", "DeepSea-Explorer MkII", "CoastalGuardian-V3"
]


def generate_realistic_name(index, dataset_type_arg):
    base_name = random.choice(BUOY_NAMES).format(idx=index + 1)
    return f"{base_name} ({dataset_type_arg.capitalize()} Focus)"

def get_realistic_location_description(dataset_type_arg):
    region_list = REGIONS.get(dataset_type_arg, REGIONS['reef']) # Default to reef regions if type unknown
    return random.choice(region_list)

def generate_dummy_data(num_buoys, readings_per_buoy, dataset_type_arg):
    data = {
        "metadata": {
            "version": f"{random.randint(1,3)}.{random.randint(0,9)}.{random.randint(0,9)}",
            "generated": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=random.randint(1, 30))).isoformat(),
            "source": "Global Oceanographic Data Network (GODN)",
            "license": "CC BY 4.0 International",
            "description": f"Comprehensive oceanographic dataset focusing on {dataset_type_arg.replace('_', ' ')}. Collected from a distributed buoy network.",
            "contactEmail": "data.services@godn-research.org",
            "citation": f"GODN Buoy Program. ({(datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=random.randint(30,90))).year}). {dataset_type_arg.capitalize().replace('_',' ')} Data. Version {random.randint(1,2)}.{random.randint(0,5)}. Global Oceanographic Data Network.",
            "parameters": {
                "temperature": {"unit": "°C", "description": "Water temperature at sensor depth", "accuracy": "±0.05°C"},
                "salinity": {"unit": "PSU", "description": "Practical Salinity Unit measurement", "accuracy": "±0.02 PSU"},
                "ph": {"unit": "pH", "description": "pH level of seawater (total scale)", "accuracy": "±0.02 pH"},
                "dissolved_oxygen": {"unit": "µmol/kg", "description": "Dissolved oxygen concentration", "accuracy": "±2 µmol/kg"},
                "turbidity": {"unit": "NTU", "description": "Water turbidity (nephelometric method)", "accuracy": "±0.5 NTU"},
                "chlorophyll": {"unit": "µg/L", "description": "Chlorophyll-a fluorescence", "accuracy": "±0.1 µg/L"},
                "wave_height": {"unit": "m", "description": "Significant wave height (spectral)", "accuracy": "±0.05m"}
            }
        },
        "buoys": []
    }

    base_lat = random.uniform(-60, 60) # More varied starting points
    base_lng = random.uniform(-170, 170)
    start_date = datetime.datetime(2021, 1, 1, tzinfo=datetime.timezone.utc) # Slightly older start date

    for i in range(num_buoys):
        # More realistic buoy IDs
        prefix = random.choice(["NPS", "ATL", "PAC", "IND", "ARC", "SOU"])
        buoy_id = f"{prefix}-{random.randint(1000,9999)}-{chr(random.randint(65,90))}"
        
        lat_offset = (random.random() * 15) - 7.5
        lng_offset = (random.random() * 30) - 15
        lat = base_lat + lat_offset * (i/(num_buoys if num_buoys > 1 else 1)) # Spread them out a bit
        lng = base_lng + lng_offset * (i/(num_buoys if num_buoys > 1 else 1))
        
        buoy_name_idx = (i + random.randint(0, len(BUOY_NAMES)-1)) % len(BUOY_NAMES)
        buoy_name = BUOY_NAMES[buoy_name_idx].format(idx=random.randint(10,99)) # More varied index for name

        buoy = {
            "id": buoy_id,
            "name": buoy_name,
            "location": {
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "description": get_realistic_location_description(dataset_type_arg)
            },
            "deployment": {
                "date": (start_date + datetime.timedelta(days=random.randint(0, 365*2))).strftime('%Y-%m-%d'),
                "depth": f"{random.randint(5, 200)}m",
                "platform": random.choice(PLATFORM_TYPES)
            },
            "readings": []
        }

        current_timestamp = start_date + datetime.timedelta(days=random.randint(0, 365*2), hours=random.randint(0,23))
        
        # More refined base values and variations
        temp_base = random.uniform(2, 30) 
        sal_base = random.uniform(30, 40)
        ph_base = random.uniform(7.5, 8.5)
        do_base = random.uniform(150, 350) # µmol/kg common unit
        turb_base = random.uniform(0.1, 20)
        chloro_base = random.uniform(0.01, 20)
        wave_base = random.uniform(0.1, 8)

        for r_idx in range(readings_per_buoy):
            current_timestamp += datetime.timedelta(hours=random.choice([1, 3, 6])) # Varied reading intervals
            reading = {"timestamp": current_timestamp.isoformat()}

            # Temperature
            t_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-2,2) # Simulate seasonal drift for active param
            t_var = random.uniform(-3, 3) + t_sim_drift if dataset_type_arg == 'temperature' else random.uniform(-0.2, 0.2)
            if dataset_type_arg == 'reef': t_var = random.uniform(-1, 1) + (random.random() * 0.2 * (r_idx/readings_per_buoy))
            reading["temperature"] = round(temp_base + t_var, 2) # Increased precision

            # Salinity
            s_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-1,1)
            s_var = random.uniform(-1.5, 1.5) + s_sim_drift if dataset_type_arg == 'salinity' else random.uniform(-0.1, 0.1)
            if dataset_type_arg == 'reef': s_var = random.uniform(-0.5, 0.5) + (random.random() * 0.1 * (r_idx/readings_per_buoy))
            reading["salinity"] = round(sal_base + s_var, 2)

            # pH
            ph_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-0.1,0.1)
            ph_var = random.uniform(-0.3, 0.3) + ph_sim_drift if dataset_type_arg == 'ph' else random.uniform(-0.02, 0.02)
            if dataset_type_arg == 'reef': ph_var = random.uniform(-0.1, 0.1) + (random.random() * 0.02 * (r_idx/readings_per_buoy))
            reading["ph"] = round(ph_base + ph_var, 2)

            # Dissolved Oxygen (µmol/kg)
            do_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-20,20)
            do_var = random.uniform(-50, 50) + do_sim_drift if dataset_type_arg == 'dissolved_oxygen' else random.uniform(-5, 5)
            if dataset_type_arg == 'reef': do_var = random.uniform(-30, 30) + (random.random() * 5 * (r_idx/readings_per_buoy))
            reading["dissolved_oxygen"] = round(max(0, do_base + do_var), 1)
            
            # Turbidity
            turb_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-3,3)
            turb_var = random.uniform(-10, 10) + turb_sim_drift if dataset_type_arg == 'turbidity' else random.uniform(-0.5, 0.5)
            if dataset_type_arg == 'reef': turb_var = random.uniform(-5, 5) + (random.random() * 1 * (r_idx/readings_per_buoy))
            reading["turbidity"] = round(max(0.1, turb_base + turb_var), 1)

            # Chlorophyll
            chloro_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-5,5)
            chloro_var = random.uniform(-10, 10) + chloro_sim_drift if dataset_type_arg == 'chlorophyll' else random.uniform(-0.5, 0.5)
            if dataset_type_arg == 'reef': chloro_var = random.uniform(-5, 5) + (random.random() * 0.5 * (r_idx/readings_per_buoy))
            reading["chlorophyll"] = round(max(0.01, chloro_base + chloro_var), 2)

            # Wave Height
            wave_sim_drift = (r_idx / readings_per_buoy - 0.5) * random.uniform(-1,1)
            wave_var = random.uniform(-2, 2) + wave_sim_drift if dataset_type_arg == 'wave_height' else random.uniform(-0.2, 0.2)
            if dataset_type_arg == 'reef': wave_var = random.uniform(-1.5, 1.5) + (random.random() * 0.3 * (r_idx/readings_per_buoy))
            reading["wave_height"] = round(max(0.1, wave_base + wave_var), 1)
            
            buoy["readings"].append(reading)
        
        data["buoys"].append(buoy)

    return data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate context-specific dummy buoy data.")
    parser.add_argument("--num_buoys", type=int, default=5, help="Number of buoys to generate.")
    parser.add_argument("--readings_per_buoy", type=int, default=2000, help="Number of readings per buoy.")
    parser.add_argument("--dataset_type", type=str, default="reef", 
                        choices=['temperature', 'salinity', 'ph', 'dissolved_oxygen', 'reef', 
                                 'turbidity', 'chlorophyll', 'wave_height'], 
                        help="Type of dataset to generate (e.g., 'temperature' for temp-focused data, 'reef' for mixed).")
    parser.add_argument("--output_file", type=str, required=True, 
                        help="Output JSON filename (e.g., public/data/large_temperature_data.json).")
    
    args = parser.parse_args()
    
    output_dir = os.path.dirname(args.output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    generated_data = generate_dummy_data(args.num_buoys, args.readings_per_buoy, args.dataset_type)
    
    with open(args.output_file, 'w') as f:
        json.dump(generated_data, f, indent=2)
        
    print(f"Generated {args.num_buoys} buoys with {args.readings_per_buoy} readings each for dataset type '{args.dataset_type}'.")
    print(f"Total {len(generated_data['buoys'])} buoys and {sum(len(b['readings']) for b in generated_data['buoys'])} total readings.")
    print(f"Data saved to {args.output_file}") 
import json
import random
import datetime
import argparse

def generate_dummy_data(num_buoys, readings_per_buoy, dataset_type_arg):
    data = {
        "metadata": {
            "version": f"1.2.0-dummy-{dataset_type_arg}",
            "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "source": "REEFlect Ocean Monitoring Network (Context-Specific Dummy Data Generator)",
            "license": "CC BY 4.0",
            "description": f"Large set of realistic dummy buoy data (type: {dataset_type_arg}) from the OpenOcean platform",
            "contactEmail": f"data-dummy-{dataset_type_arg}@reeflect.org",
            "citation": f"REEFlect Ocean Monitoring Network (Dummy Data Generator, 2024, type: {dataset_type_arg})",
            "parameters": { # Keeping all parameters in metadata for now
                "temperature": {"unit": "°C", "description": "Water temperature at 1m depth", "accuracy": "±0.1°C"},
                "salinity": {"unit": "PSU", "description": "Practical Salinity Unit measurement", "accuracy": "±0.01 PSU"},
                "ph": {"unit": "pH", "description": "pH level of seawater", "accuracy": "±0.01 pH"},
                "dissolved_oxygen": {"unit": "mg/L", "description": "Dissolved oxygen concentration", "accuracy": "±0.1 mg/L"},
                "turbidity": {"unit": "NTU", "description": "Water turbidity", "accuracy": "±0.5 NTU"},
                "chlorophyll": {"unit": "µg/L", "description": "Chlorophyll-a concentration", "accuracy": "±0.2 µg/L"},
                "wave_height": {"unit": "m", "description": "Significant wave height", "accuracy": "±0.1m"}
            }
        },
        "buoys": []
    }

    base_lat = -20.0
    base_lng = 145.0
    start_date = datetime.datetime(2022, 1, 1, tzinfo=datetime.timezone.utc)

    for i in range(num_buoys):
        buoy_id = f"DUMMY_{dataset_type_arg.upper()}_B{str(i+1).zfill(3)}"
        lat = base_lat + (random.random() * 10) - 5
        lng = base_lng + (random.random() * 20) - 10
        
        buoy = {
            "id": buoy_id,
            "name": f"Dummy Buoy Location {i+1} ({dataset_type_arg})",
            "location": {
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "description": f"Generated location {i+1} for {dataset_type_arg} data"
            },
            "deployment": {
                "date": (start_date + datetime.timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d'),
                "depth": f"{random.randint(10, 100)}m",
                "platform": random.choice([f"REEFlect-Dummy-{dataset_type_arg.upper()}", "OceanSense-X-Context"])
            },
            "readings": []
        }

        current_timestamp = start_date + datetime.timedelta(hours=random.randint(0, 24*30))
        
        temp_base = random.uniform(15, 25)
        sal_base = random.uniform(34, 36)
        ph_base = random.uniform(7.9, 8.2)
        do_base = random.uniform(6, 8)
        turb_base = random.uniform(0.5, 5)
        chloro_base = random.uniform(0.1, 2)
        wave_base = random.uniform(0.2, 1.5)

        for r_idx in range(readings_per_buoy):
            current_timestamp += datetime.timedelta(hours=1)
            reading = {"timestamp": current_timestamp.isoformat()}

            # Temperature
            t_var = random.uniform(-2.5, 2.5) if dataset_type_arg == 'temperature' else random.uniform(-0.1, 0.1)
            if dataset_type_arg == 'reef': t_var = random.uniform(-0.5, 0.5) + (random.random() * 0.1 * (r_idx/100))
            reading["temperature"] = round(temp_base + t_var, 1)

            # Salinity
            s_var = random.uniform(-1.0, 1.0) if dataset_type_arg == 'salinity' else random.uniform(-0.05, 0.05)
            if dataset_type_arg == 'reef': s_var = random.uniform(-0.2, 0.2) + (random.random() * 0.05 * (r_idx/100))
            reading["salinity"] = round(sal_base + s_var, 1)

            # pH
            ph_var = random.uniform(-0.2, 0.2) if dataset_type_arg == 'ph' else random.uniform(-0.01, 0.01)
            if dataset_type_arg == 'reef': ph_var = random.uniform(-0.05, 0.05) + (random.random() * 0.01 * (r_idx/100))
            reading["ph"] = round(ph_base + ph_var, 2)

            # Dissolved Oxygen
            do_var = random.uniform(-1.5, 1.5) if dataset_type_arg == 'dissolved_oxygen' else random.uniform(-0.1, 0.1)
            if dataset_type_arg == 'reef': do_var = random.uniform(-0.3, 0.3) + (random.random() * 0.05 * (r_idx/100))
            reading["dissolved_oxygen"] = round(do_base + do_var, 1)
            
            # Turbidity
            turb_var = random.uniform(-5, 5) if dataset_type_arg == 'turbidity' else random.uniform(-0.2, 0.2)
            if dataset_type_arg == 'reef': turb_var = random.uniform(-1, 1) + (random.random() * 0.2 * (r_idx/100))
            reading["turbidity"] = round(max(0.1, turb_base + turb_var), 1)

            # Chlorophyll
            chloro_var = random.uniform(-2, 2) if dataset_type_arg == 'chlorophyll' else random.uniform(-0.1, 0.1)
            if dataset_type_arg == 'reef': chloro_var = random.uniform(-0.5, 0.5) + (random.random() * 0.1 * (r_idx/100))
            reading["chlorophyll"] = round(max(0.01, chloro_base + chloro_var), 2)

            # Wave Height
            wave_var = random.uniform(-1, 1) if dataset_type_arg == 'wave_height' else random.uniform(-0.1, 0.1)
            if dataset_type_arg == 'reef': wave_var = random.uniform(-0.5, 0.5) + (random.random() * 0.1 * (r_idx/100))
            reading["wave_height"] = round(max(0.1, wave_base + wave_var), 1)
            
            buoy["readings"].append(reading)
        
        data["buoys"].append(buoy)

    return data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate context-specific dummy buoy data.")
    parser.add_argument("--num_buoys", type=int, default=5, help="Number of buoys to generate.")
    parser.add_argument("--readings_per_buoy", type=int, default=2000, help="Number of readings per buoy.")
    parser.add_argument("--dataset_type", type=str, default="reef", # Default to 'reef' for mixed-like behavior
                        choices=['temperature', 'salinity', 'ph', 'dissolved_oxygen', 'reef', 
                                 'turbidity', 'chlorophyll', 'wave_height'], 
                        help="Type of dataset to generate (e.g., 'temperature' for temp-focused data, 'reef' for mixed).")
    parser.add_argument("--output_file", type=str, required=True, 
                        help="Output JSON filename (e.g., public/data/large_temperature_data.json).")
    
    args = parser.parse_args()
    
    # Ensure the output directory exists
    import os
    output_dir = os.path.dirname(args.output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    dummy_data = generate_dummy_data(args.num_buoys, args.readings_per_buoy, args.dataset_type)
    
    with open(args.output_file, 'w') as f:
        json.dump(dummy_data, f, indent=2)
        
    print(f"Generated {args.num_buoys} buoys with {args.readings_per_buoy} readings each for dataset type '{args.dataset_type}'.")
    print(f"Total {len(dummy_data['buoys'])} buoys and {sum(len(b['readings']) for b in dummy_data['buoys'])} total readings.")
    print(f"Dummy data saved to {args.output_file}") 
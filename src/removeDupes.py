# Removes duplicate landmarks from the json file
import json

def remove_duplicates(json_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    unique_landmarks = []
    seen_swedish_names = set()

    for landmark in data['landmarks']:
        swedish_name = landmark['swedish']
        if swedish_name not in seen_swedish_names:
            unique_landmarks.append(landmark)
            seen_swedish_names.add(swedish_name)

    data['landmarks'] = unique_landmarks

    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# Usage example
json_file_path = 'landmarks.json'
remove_duplicates(json_file_path)



from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from typing import List, Dict
app = Flask(__name__)
CORS(app)


def parse_robot_logs(log_text: str) -> List[Dict[str, str]]:
    """
    Parse robot log entries from a given text string.
    
    Args:
        log_text (str): Raw log text to parse
    
    Returns:
        List[Dict[str, str]]: List of parsed log entries with timestamp, level, node, and message
    """
    # Regex pattern to match log entries
    log_pattern = r'\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \[(\w+)\] \[(/\w+)\] (.+)'
    
    # Find all matches in the log text
    log_entries = re.findall(log_pattern, log_text)
    
    # Convert matches to list of dictionaries
    parsed_logs = [
        {
            'timestamp': match[0],
            'level': match[1],
            'node': match[2],
            'message': match[3]
        }
        for match in log_entries
    ]
    
    return parsed_logs



# Function to parse the log file content
def parse_log(file_content):
    logs = []

    print(file_content)
    
    # Updated regex to capture timestamp, severity, node, and message
    pattern = re.compile(r'\[(.*?)\]\s+(\w+)\s+\[(.*?)\]\s+([^\[]*)')
    
    # Split the file content into lines and match each line with the regex pattern
    for line in file_content.splitlines():
        match = pattern.match(line.strip())  # .strip() to clean extra spaces
        if match:
            logs.append({
                "timestamp": match.group(1),
                "severity": match.group(2),
                "node": match.group(3),
                "message": match.group(4).strip(),  # Strip extra spaces in the message
            })
    # print(logs)
    return logs

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # Ensure the file is not empty
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Read and decode the file content
    try:
        content = file.read().decode("utf-8")
        logs = parse_robot_logs(content)
        return jsonify({"logs": logs})
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500
    
@app.route('/', methods=['GET'])
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)

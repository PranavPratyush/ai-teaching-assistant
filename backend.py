import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE_NAME = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row 
    return conn

def init_db():
    if not os.path.exists(DATABASE_NAME):
        try:
            conn = get_db_connection()
            conn.execute('''
                CREATE TABLE notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    english_note TEXT NOT NULL,
                    translated_note TEXT NOT NULL,
                    language TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
            print(f"Database '{DATABASE_NAME}' created successfully.")
        except Exception as e:
            print(f"An error occurred while initializing the database: {e}")
        finally:
            if conn:
                conn.close()

@app.route('/')
def index():
    return "Backend server for AI Teaching Assistant is running!"

@app.route('/api/save_note', methods=['POST'])
def save_note():
    try:
        data = request.get_json()
        eng_note = data['english_note']
        trans_note = data['translated_note']
        lang = data['language']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO notes (english_note, translated_note, language) VALUES (?, ?, ?)',
            (eng_note, trans_note, lang)
        )
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Note saved successfully!'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/get_notes', methods=['GET'])
def get_notes():
    try:
        conn = get_db_connection()
        notes_cursor = conn.execute('SELECT * FROM notes ORDER BY created_at DESC')
        notes = [dict(row) for row in notes_cursor.fetchall()]
        conn.close()
        return jsonify(notes)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("Starting Flask server, listening on all network interfaces...")
    # --- THE FIX IS HERE ---
    # We add host='0.0.0.0' to make the server accessible from your network,
    # not just from your local computer.
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)

from flask import Blueprint, request, jsonify
from .gemini_service import ask_gemini

main = Blueprint('main', __name__)

@main.route('/api/rpg', methods=['POST'])
def rpg_interaction():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    response = ask_gemini(user_message)
    return jsonify({'response': response})

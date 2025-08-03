# Frontend.py - Fixed version
# Streamlit Frontend for Fashion Chatbot

import streamlit as st
import requests
import json
from PIL import Image
import io

# --- Page config and styling ---
st.set_page_config(
    page_title="Fashion AI",
    page_icon="✨",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS for chat bubbles and styles
st.markdown("""
<style>
.stApp {
    background-color: #f0f2f6;
    background-image: radial-gradient(circle at center, #ffffff 50%, #e9eef5 100%);
    min-height: 100vh;
}
.main .block-container {
    padding-top: 5rem;
    padding-bottom: 5rem;
    max-width: 700px;
    margin: auto;
    text-align: center;
}
header, footer {
    visibility: hidden;
}
.logo {
    font-size: 2.5em;
    margin-bottom: 0.5em;
}
.chat-bubble {
    padding: 10px 15px;
    border-radius: 15px;
    margin-bottom: 10px;
    max-width: 70%;
    display: inline-block;
    text-align: left;
    word-wrap: break-word;
    white-space: pre-wrap;
}
.user-bubble {
    background-color: #0b93f6;
    color: white;
    margin-left: auto;
}
.assistant-bubble {
    background-color: #e5e5ea;
    color: black;
    margin-right: auto;
}

.fashion-header {
    text-align: center;
    font-size: 2.5em;
    color: #0b93f6;
    font-weight: bold;
    margin-bottom: 30px;
}

.suggestion-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.suggestion-button {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
    transition: all 0.3s ease;
}

.suggestion-button:hover {
    background-color: #e9ecef;
    color: #0b93f6;
}

.status-indicator {
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    margin: 15px 0;
    font-weight: 600;
    display: inline-block;
    text-align: center;
}

.status-connected {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.stButton>button {
    background-color: #0b93f6;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 16px;
    transition: 0.3s ease;
}

.stButton>button:hover {
    background-color: #0084e3;
}

input, textarea, .stTextInput>div>div>input {
    border-radius: 20px !important;
    border: 1px solid #dee2e6 !important;
    padding: 10px 15px !important;
    font-size: 16px !important;
}

.stFileUploader {
    background-color: #f8f9fa !important;
    border: 1px solid #dee2e6 !important;
    border-radius: 15px !important;
    padding: 10px !important;
}

.custom-hr {
    border: none;
    height: 1px;
    background-color: #dee2e6;
    margin: 25px 0;
}

.footer-text {
    text-align: center;
    font-size: 0.9em;
    color: #6c757d;
    font-weight: 500;
    margin-top: 30px;
}

.chat-container {
    text-align: left;
    margin: 20px 0;
}

.bubble-container {
    margin: 10px 0;
    display: flex;
}

.bubble-container.user {
    justify-content: flex-end;
}

.bubble-container.assistant {
    justify-content: flex-start;
}
</style>
""", unsafe_allow_html=True)

# --- Configuration ---
api_url = "https://fashion-chatbot-backend.onrender.com"
user_id = "streamlit_user_01"

# --- Header and Introduction ---
st.markdown('<p class="logo">✨</p>', unsafe_allow_html=True)
st.title("Ask our Fashion AI anything")

# --- Suggestions Section ---
st.write("### 💡 Quick Suggestions")
suggestions = [
    "Help me find an outfit for a job interview",
    "Suggest outfits for a beach vacation",
    "Recommend shoes for a summer wedding",
]

# Create columns for suggestions
cols = st.columns(3)
for i, suggestion in enumerate(suggestions):
    col_idx = i % 3
    if cols[col_idx].button(suggestion, key=f"suggestion_{i}"):
        st.session_state["pending_suggestion"] = suggestion

# --- Initialize Session State ---
if "messages" not in st.session_state:
    st.session_state["messages"] = []
if "pending_suggestion" not in st.session_state:
    st.session_state["pending_suggestion"] = ""

# Test backend connection
def test_backend_connection(api_url):
    """Test if backend is available"""
    try:
        response = requests.get(f"{api_url}/health", timeout=10)
        if response.status_code == 200:
            try:
                data = response.json()
                return True, data.get("message", "Connected")
            except json.JSONDecodeError:
                return True, "Connected (text response)"
        else:
            return False, f"HTTP {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, "Connection refused - Backend not reachable"
    except requests.exceptions.Timeout:
        return False, "Connection timeout"
    except Exception as e:
        return False, f"Error: {str(e)}"

# --- Backend API Functions ---
def call_backend_api(user_id, message, image_file=None):
    """Call the backend API with proper error handling - FIXED VERSION"""
    try:
        # Always use form data to match backend expectations
        data = {
            "user_id": user_id,
            "message": message
        }
        
        files = {}
        if image_file is not None:
            files["image"] = (image_file.name, image_file.getvalue(), image_file.type)
        
        # Send as form data (not JSON) for consistency
        response = requests.post(f"{api_url}/chat", data=data, files=files, timeout=60)
        
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "Cannot connect to backend API. The server might be temporarily unavailable."
        }
    except requests.exceptions.Timeout:
        return {
            "success": False, 
            "error": "Request timed out. Please try again."
        }
    except requests.exceptions.HTTPError as e:
        try:
            error_msg = e.response.json().get('detail', str(e))
        except:
            error_msg = f"HTTP {e.response.status_code}: {e.response.text}"
        return {
            "success": False,
            "error": error_msg
        }
    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "Invalid response from server"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }

def process_user_input(text_input, uploaded_file):
    """Process user input and get AI response"""
    content = text_input.strip() if text_input else ""
    
    # Allow text-only OR image-only OR both, but require at least one
    if not content and uploaded_file is None:
        st.warning("Please enter a message or upload an image.")
        return
    
    # If no text but image is provided, use default message for analysis
    if not content and uploaded_file is not None:
        content = "Please analyze this fashion image and provide styling advice"
    
    # Determine the display message
    if uploaded_file is not None:
        user_message = f"📸 {content}"
    else:
        user_message = content
    
    # Add user message to chat
    st.session_state["messages"].append({
        "role": "user", 
        "content": user_message, 
        "image": uploaded_file
    })
    
    # Call backend API
    with st.spinner("🤔 Give me a moment..."):
        result = call_backend_api(user_id, content, image_file=uploaded_file)
    
    # Process API response
    if result.get("success", True) and not result.get("error"):
        answer = result.get("answer", result.get("response", "I'm not sure how to respond to that."))
        
        # Add recommendations if available
        recommendations = result.get("recommendations", [])
        if recommendations:
            answer += "\n\n### 🛍 *Personalized Recommendations:*\n"
            for i, rec in enumerate(recommendations, 1):
                if isinstance(rec, dict):
                    name = rec.get('name', 'Unknown item')
                    price = rec.get('price', 'N/A')
                    brand = rec.get('brand', 'Unknown brand')
                    answer += f"{i}. *{name}* - ${price} ({brand})\n"
                else:
                    answer += f"{i}. {rec}\n"
    else:
        error_msg = result.get('error', 'Unknown error occurred')
        answer = f"🚨 *Error:* {error_msg}"
    
    # Add AI response to chat
    st.session_state["messages"].append({
        "role": "assistant", 
        "content": answer
    })

# --- Main Chat Interface ---
st.markdown('<hr class="custom-hr">', unsafe_allow_html=True)

st.write("# Chat with Fashion AI")

# Main input form
with st.form("chat_form", clear_on_submit=True):
    # Handle pending suggestion
    initial_text = st.session_state.get("pending_suggestion", "")
    if initial_text:
        st.session_state["pending_suggestion"] = ""  # Clear after use
    
    # User input - Main text input
    user_input = st.text_input(
        "Ask me anything about fashion and style:",
        value=initial_text,
        placeholder="e.g., 'What should I wear to a summer wedding?' or 'Give me outfit ideas for work'",
        help="Ask for outfit recommendations, styling advice, color coordination tips, and more!"
    )
    
    # File upload (truly optional now)
    uploaded_file = st.file_uploader(
        "📸 Upload outfit image (optional)",
        type=["jpg", "jpeg", "png"],
        help="Optionally upload an image for AI analysis and styling advice"
    )
    
    # Preview uploaded image
    if uploaded_file is not None:
        st.write("*Image Preview:*")
        try:
            image = Image.open(uploaded_file)
            st.image(image, caption=f"Uploaded: {uploaded_file.name}", width=300)
        except Exception as e:
            st.error(f"Error loading image: {str(e)}")
    
    # Submit button
    submitted = st.form_submit_button("🔎 Send", type="primary")
    
    if submitted:
        process_user_input(user_input, uploaded_file)

# Display connection status AFTER the search bar
is_connected, status_msg = test_backend_connection(api_url)
if is_connected:
    st.markdown(f'<div class="status-indicator status-connected">✅ Backend Connected: {status_msg}</div>', unsafe_allow_html=True)
else:
    st.markdown(f'<div class="status-indicator status-error">❌ Backend Disconnected: {status_msg}</div>', unsafe_allow_html=True)
    st.warning("⚠ Backend API is not available. Please check your internet connection or try again later.")

# --- Display Chat History ---
if st.session_state["messages"]:
    st.markdown('<hr class="custom-hr">', unsafe_allow_html=True)
    st.write("### Chat History")
    
    # Create chat container
    st.markdown('<div class="chat-container">', unsafe_allow_html=True)
    
    for i, msg in enumerate(st.session_state["messages"]):
        if msg["role"] == "user":
            # User message with new bubble styling
            st.markdown(f'''
            <div class="bubble-container user">
                <div class="chat-bubble user-bubble">
                    👤 You: {msg["content"]}
                </div>
            </div>
            ''', unsafe_allow_html=True)
            
            # Display user's uploaded image if any
            if msg.get("image") is not None:
                try:
                    image = Image.open(msg["image"])
                    st.image(image, caption="Your uploaded image", width=250)
                except Exception as e:
                    st.write("🖼 [Image was uploaded but cannot be displayed]")
        
        else:
            # Assistant message with new bubble styling
            st.markdown(f'''
            <div class="bubble-container assistant">
                <div class="chat-bubble assistant-bubble">
                    🤖 Fashion AI: {msg["content"]}
                </div>
            </div>
            ''', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

# --- Sidebar with Additional Features ---
with st.sidebar:
    st.write("### 👗 AuraAI Fashion Chatbot")
    
    st.markdown('<hr class="custom-hr">', unsafe_allow_html=True)

    st.write("### Your Session")
    st.write(f"*User ID:* {user_id}")
    st.write(f"*Messages:* {len(st.session_state['messages'])}")
    
    if st.button("🗑 Delete Chat History"):
        st.session_state["messages"] = []
        st.rerun()
    
    st.markdown('<hr class="custom-hr">', unsafe_allow_html=True)

    st.write("### ℹ Tips")
    st.write("""
    💡 *For best results:*
    - Be specific about occasions
    - Mention your style preferences  
    - Upload clear, well-lit images (optional)
    - Ask follow-up questions
    - Try the quick suggestions above
    """)

# --- Footer ---
st.markdown('<hr class="custom-hr">', unsafe_allow_html=True)

st.markdown('''
<div class="footer-text">
    ✨ Thank you for using the Fashion AI Stylist! Stay amazing, stay stylish! ✨
</div>
''', unsafe_allow_html=True)

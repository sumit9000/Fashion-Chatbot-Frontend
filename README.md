# 🖼 Fashion Chatbot UI (Frontend)

This repository contains the *Streamlit-based frontend* for the Fashion Chatbot. It allows users to interact with the chatbot through a clean web interface and receive fashion advice in real-time.

---

## 💡 Features

- Interactive UI built with Streamlit
- Connects to FastAPI backend for chat responses
- Real-time fashion recommendations
- Responsive layout and easy-to-use design

---

## 📁 Folder Structure


frontend/
├── app.py                     # Streamlit app
├── requirements.txt           # Dependencies
└── .streamlit/
    └── secrets.toml           # API URL config


---

## 🔧 Installation

1. Clone the repository:

bash
git clone https://github.com/your-username/fashion-chatbot-frontend.git
cd fashion-chatbot-frontend


2. Install required packages:

bash
pip install -r requirements.txt


---

## 🔐 Configuration

Create a file .streamlit/secrets.toml with the following content:

toml
api_url = "https://your-backend.onrender.com"


Replace the URL with your actual FastAPI backend URL.

---

## ▶ Run Locally

bash
streamlit run app.py


Open in browser:  
🔗 http://localhost:8501

---

## 🌍 Deploy on Render

1. Push the frontend folder to GitHub.
2. Create a *Web Service* on [Render](https://render.com).
3. Set the *Start Command*:

bash
streamlit run app.py --server.port 10000 --server.address 0.0.0.0


4. Add a *Secret File*:
    - File name: .streamlit/secrets.toml
    - Content:

toml
api_url = "https://your-backend.onrender.com"


---

## 📸 UI Preview

> (Optional) Add a screenshot here of the chatbot interface  
> ![UI Screenshot](link-to-screenshot)

---

## 📬 Contact

Made with ❤ by [Your Name]  
📧 [your-email@example.com](mailto:your-email@example.com)  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)

# Fashion Chatbot Frontend (Streamlit)

This is the *frontend* of the AI-powered Fashion Chatbot built using *Streamlit*. It provides an elegant interface for users to ask fashion-related questions and receive smart, AI-generated responses from the backend API.

---

##  Features

* Beautiful UI with custom CSS styling
* Chat interface with assistant/user bubbles
* Predefined suggestions (buttons) for quick questions
* Real-time API communication with the backend
* Styled with light backgrounds and soft shadows for modern aesthetics

---

##  Tech Stack

* *Frontend Framework*: Streamlit
* *Language*: Python
* *Backend API*: FastAPI (hosted separately on Render)
* *Deployment*: Streamlit + Render

---


## ⚙ Setup Instructions

### 1. Clone the Repository

bash
git clone https://github.com/sumit9000/fashion-chatbot-frontend.git
cd fashion-chatbot-frontend


### 2. Install Dependencies

bash
pip install -r requirements.txt


### 3. Connect to Backend API

Edit the API_URL in app.py:

python
API_URL = " "


> ✅ Ensure your backend API is live and accepting POST requests.

---

## ▶ Run the App

bash
streamlit run app.py


The app will open in your browser at http://localhost:8501.

---

## 🌐 Deployment on Render (Frontend)

1. Push this repo to GitHub.
2. Go to [https://render.com](https://render.com) → New → Web Service.
3. Select *Python* → Add your repo.
4. Use:

   * *Start Command*: streamlit run app.py
   * *Build Command*: pip install -r requirements.txt
5. Add environment variable if needed: API_URL (optional if hardcoded).

---

##  Sample Questions to Ask

* "What are the trends for summer?"
* "Suggest an outfit for a casual day."
* "Help me find a dress for a wedding."
* "What goes with a blue suit?"

---

## 📸 Screenshot

> <img width="1902" height="697" alt="image" src="https://github.com/user-attachments/assets/6551b6b3-7eb3-40c0-9bd0-52483115c4e7" />


---

## 📬 Contact

Built by [Sumit Kumar](https://www.linkedin.com/in/sumitkumarss/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

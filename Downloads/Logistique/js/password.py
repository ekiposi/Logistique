import re
import os
import tkinter as tk
from tkinter import messagebox

def modify_password(filename, username, new_password):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, filename)
        
        with open(file_path, 'r') as file:
            content = file.read()
        
        pattern = f'(username: \'{re.escape(username)}\', password: \').*?(\', redirectUrl:)'
        replacement = f'\\1{new_password}\\2'
        
        modified_content = re.sub(pattern, replacement, content)
        
        with open(file_path, 'w') as file:
            file.write(modified_content)
            
        messagebox.showinfo("Succès", f"Mot de passe mis à jour avec succès pour l'utilisateur '{username}'")
            
    except FileNotFoundError:
        messagebox.showerror("Erreur", f"Fichier '{filename}' introuvable dans {script_dir}")
    except Exception as e:
        messagebox.showerror("Erreur", f"Une erreur s'est produite: {str(e)}")

def submit():
    username = username_entry.get()
    new_password = password_entry.get()
    
    if username and new_password:
        modify_password('script.js', username, new_password)
    else:
        messagebox.showwarning("Attention", "Veuillez remplir tous les champs")

def toggle_password_visibility():
    if show_password_var.get():
        password_entry.config(show="")
    else:
        password_entry.config(show="*")

# Créer la fenêtre principale
root = tk.Tk()
root.title("Modificateur de Mot de Passe")
root.geometry("300x200")

# Créer et organiser les widgets
frame = tk.Frame(root, padx=20, pady=20)
frame.pack(expand=True)

username_label = tk.Label(frame, text="Nom d'utilisateur:")
username_label.pack(anchor="w")

username_entry = tk.Entry(frame)
username_entry.pack(fill="x", pady=(0, 10))

password_label = tk.Label(frame, text="Nouveau mot de passe:")
password_label.pack(anchor="w")

password_entry = tk.Entry(frame, show="*")
password_entry.pack(fill="x", pady=(0, 10))

# Ajouter la case à cocher pour la visibilité du mot de passe
show_password_var = tk.BooleanVar()
show_password_checkbox = tk.Checkbutton(
    frame, 
    text="Afficher le mot de passe",
    variable=show_password_var,
    command=toggle_password_visibility
)
show_password_checkbox.pack(anchor="w", pady=(0, 10))

submit_button = tk.Button(frame, text="Mettre à jour le mot de passe", command=submit)
submit_button.pack()

# Démarrer l'interface graphique
root.mainloop()
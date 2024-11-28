import tkinter
from tkinter import *
from tkinter import filedialog, messagebox
import threading
from spellchecker import SpellChecker

filename = None

# Function to check spelling
def spellCheck():
    text_content = text.get(0.0, END)
    spell = SpellChecker()
    words = text_content.split()
    misspelled = spell.unknown(words)
    
    # Clear previous highlights
    text.tag_remove("misspelled", "1.0", END)
    
    # Highlight misspelled words
    for word in misspelled:
        start_index = text.search(word, "1.0", stopindex=END)
        while start_index:
            end_index = f"{start_index}+{len(word)}c"
            text.tag_add("misspelled", start_index, end_index)
            start_index = text.search(word, end_index, stopindex=END)

    # Set tag configuration for misspelled words (red underline)
    text.tag_config("misspelled", foreground="red", underline=True)

# Function to run spell check in a separate thread
def startSpellCheck():
    spell_thread = threading.Thread(target=spellCheck)
    spell_thread.start()

def autoSpellCheck():
    startSpellCheck()  # Run the spell checker in the background
    root.after(1000,autoSpellCheck)

# Other text editor functions (save, open, new)
def newFile():
    global filename
    filename = "untitled"
    text.delete(0.0, END)

def saveFile():
    global filename
    t = text.get(0.0, END)
    f = open(filename, 'w')
    f.write(t)
    f.close()

def saveAs():
    f = filedialog.asksaveasfile("w", defaultextension='.txt')
    t = text.get(0.0, END)
    try:
        f.write(t.rstrip())
    except:
        messagebox.showerror(title="Error Occured!", message="Don't worry! We are trying to fix it")

def openFile():
    f = filedialog.askopenfile('r', defaultextension='.txt')
    if f is not None:
        text.delete(0.0, END)  # Clear the text widget
        t = f.read()  # Read the file content
        text.insert(0.0, t)  # Insert the content into the text widget

# Cut, Copy, Paste, Undo, Redo functions
def cut():
    text.event_generate("<<Cut>>")

def copy():
    text.event_generate("<<Copy>>")

def paste():
    text.event_generate("<<Paste>>")

def undo():
    text.edit_undo()

def redo():
    text.edit_redo()

# Create the main window
root = Tk()
root.title("My Python Text Editor")
root.minsize(900, 900)
root.maxsize(900, 900)

# Enable undo/redo in the Text widget
text = Text(root, height=900, width=900, undo=True)
text.pack()

# Create the menu bar
menubar = Menu(root)

# File menu
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="New", command=newFile)
filemenu.add_command(label="Open", command=openFile)
filemenu.add_command(label="Save", command=saveFile)
filemenu.add_command(label="Save As", command=saveAs)
filemenu.add_separator()
filemenu.add_command(label="Quit", command=root.quit)
menubar.add_cascade(label="File", menu=filemenu)

# Edit menu for Cut, Copy, Paste, Undo, Redo
editmenu = Menu(menubar, tearoff=0)
editmenu.add_command(label="Undo", command=undo)
editmenu.add_command(label="Redo", command=redo)
editmenu.add_separator()
editmenu.add_command(label="Cut", command=cut)
editmenu.add_command(label="Copy", command=copy)
editmenu.add_command(label="Paste", command=paste)
menubar.add_cascade(label="Edit", menu=editmenu)

# Configure the window to use the menu
root.config(menu=menubar)

# Run the application
root.after(1000, autoSpellCheck)  # Start spell checking after 1 second
root.mainloop()

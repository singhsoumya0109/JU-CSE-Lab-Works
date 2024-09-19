#!/bin/bash

# Function to count lines and words in a file
count_lines_and_words() {
  local file="$1"
  
  if [ -f "$file" ]; then
    # File exists, count lines and words
    local line_count=$(wc -l < "$file")
    local word_count=$(wc -w < "$file")
    
    echo "Number of lines: $line_count"
    echo "Number of words: $word_count"
  else
    # File does not exist, create it and prompt user for content
    echo "File does not exist. Creating the file..."
    touch "$file"
    echo "Enter content for the file (end input with EOF):"
    
    # Read user input until EOF (Ctrl+D)
    cat > "$file"
    
    # Recalculate lines and words
    local line_count=$(wc -l < "$file")
    local word_count=$(wc -w < "$file")
    
    echo "Number of lines: $line_count"
    echo "Number of words: $word_count"
  fi
}

# Prompt user for filename
read -p "Enter the filename: " filename

# Call the function with the specified filename
count_lines_and_words "$filename"

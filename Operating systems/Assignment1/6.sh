#!/bin/bash

# Check if a file name was provided as an argument
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 filename"
  exit 1
fi

# Assign the provided filename to a variable
filename="$1"

# Check if the file exists
if [ ! -f "$filename" ]; then
  echo "File not found: $filename"
  exit 1
fi

# Prompt the user for a string to search for
read -p "Enter the word to search for: " search_word

# Check if the user provided a word
if [ -z "$search_word" ]; then
  echo "No word provided."
  exit 1
fi

# Initialize a counter for the total number of occurrences
total_occurrences=0

# Use awk to search for the word and get the results
awk -v word="$search_word" '
  {
    line_number = FNR
    line_occurrences = gsub(word, "&")
    if (line_occurrences > 0) {
      total_occurrences += line_occurrences
      print "Line " line_number ": " line_occurrences " occurrence(s)"
    }
  }
  END {
    if (total_occurrences > 0) {
      print "Total occurrences: " total_occurrences
    } else {
      print "The word '" word "' was not found in the file."
    }
  }
' "$filename"


#!/bin/bash

# Prompt user to enter values for uv1 and uv2
read -p "Enter value for uv1: " uv1
read -p "Enter value for uv2: " uv2

# Function to reverse a string
reverse_string() {
  local str="$1"
  echo "$str" | rev
}

# Print the variables in reverse order
echo "Reverse of uv1: $(reverse_string "$uv1")"
echo "Reverse of uv2: $(reverse_string "$uv2")"

# Function to check if a string is a number (integer or real)
is_number() {
  local value="$1"
  [[ "$value" =~ ^-?[0-9]+(\.[0-9]+)?$ ]]
}

# Attempt to add the two variables
if is_number "$uv1" && is_number "$uv2"; then
  # Convert to appropriate numeric type and add
  sum=$(echo "$uv1 + $uv2" | bc)
  echo "Sum of uv1 and uv2: $sum"
else
  echo "Error: One or both of the variables are not numbers or cannot be added."
fi

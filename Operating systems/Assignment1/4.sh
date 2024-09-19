#!/bin/bash

# Function to convert a date from DD/MM/YYYY to YYYY-MM-DD format
convert_date() {
  local date="$1"
  echo "$(echo $date | awk -F/ '{print $3"-"$2"-"$1}')"
}

# Function to calculate the day of the week for a given date
day_of_week() {
  local date="$1"
  date -d "$date" +"%A"
}

# Function to calculate age from a given birthdate
calculate_age() {
  local birthdate="$1"
  
  # Get current date in YYYY-MM-DD format
  local current_date=$(date +%F)
  
  # Calculate age in years, months, and days using date command
  local age_years=$(date -d "$current_date" +%Y)
  local birth_year=$(date -d "$birthdate" +%Y)
  local age_months=$(date -d "$current_date" +%m)
  local birth_month=$(date -d "$birthdate" +%m)
  local age_days=$(date -d "$current_date" +%d)
  local birth_day=$(date -d "$birthdate" +%d)

  local age_in_years=$((age_years - birth_year))
  local age_in_months=$((age_months - birth_month))
  local age_in_days=$((age_days - birth_day))

  # Adjust age if the current month and day are before the birth month and day
  if [ $age_in_days -lt 0 ]; then
    age_in_months=$((age_in_months - 1))
    age_in_days=$((age_days + $(date -d "$current_date" +%d -d "$birthdate" +%d)))
  fi
  if [ $age_in_months -lt 0 ]; then
    age_in_years=$((age_in_years - 1))
    age_in_months=$((age_in_months + 12))
  fi
  
  echo "$age_in_years years, $age_in_months months, $age_in_days days"
}

# Prompt user to enter two birthdays in DD/MM/YYYY format
read -p "Enter the first birthday (DD/MM/YYYY): " birthday1
read -p "Enter the second birthday (DD/MM/YYYY): " birthday2

# Convert the dates to YYYY-MM-DD format
date1=$(convert_date "$birthday1")
date2=$(convert_date "$birthday2")

# Get the day of the week for both dates
day1=$(day_of_week "$date1")
day2=$(day_of_week "$date2")

# Compare the days of the week
if [ "$day1" == "$day2" ]; then
  echo "Both birthdays fall on the same day of the week: $day1"
else
  echo "The birthdays fall on different days of the week: $day1 and $day2"
fi

# Calculate and display the age for both birthdays
echo "Calculating age for the first birthday ($date1):"
age1=$(calculate_age "$date1")
echo "Age: $age1"

echo "Calculating age for the second birthday ($date2):"
age2=$(calculate_age "$date2")
echo "Age: $age2"

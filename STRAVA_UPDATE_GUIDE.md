# Strava Year in Review Update Guide

This guide documents how to update the Year in Review page with new Strava activity data.

## Prerequisites

- Python 3 with pandas and fitparse libraries
- Strava bulk export (download from Strava Settings > My Account > Download or Delete Your Account)

## Data Source

Strava bulk export contains:
- `activities.csv` - Summary of all activities
- `activities/` folder - Individual GPX/FIT files for each activity

### Critical: CSV Column Mapping

The CSV has **duplicate column names**. Use column indices, not headers:

| Column Index | Field | Unit |
|-------------|-------|------|
| 0 | Activity ID | - |
| 2 | Activity Date | UTC timestamp |
| 3 | Activity Type | Run, Walk, Hike, etc. |
| 4 | Activity Name | - |
| 6 | Distance | **Kilometers** |
| 16 | Moving Time | Seconds |
| 20 | Elevation Gain | Meters |
| 34 | Calories | kcal |

### Unit Conversions

```python
miles = distance_km / 1.60934
minutes = moving_time_sec / 60
feet = elevation_m * 3.28084
pace_min_per_mile = minutes / miles
```

## Step 1: Analyze New Activities

```python
import csv
from datetime import datetime

with open('activities.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)

    for row in reader:
        activity_date = datetime.strptime(row[2], "%b %d, %Y, %I:%M:%S %p")
        activity_type = row[3]
        name = row[4]
        distance_km = float(row[6]) if row[6] else 0
        moving_time_sec = float(row[16]) if row[16] else 0
        elevation_m = float(row[20]) if row[20] else 0

        # Filter for activities after last update
        if activity_date >= datetime(2024, 12, 1):
            miles = distance_km / 1.60934
            print(f"{activity_date}: {activity_type} - {name} - {miles:.2f} mi")
```

## Step 2: Update Statistics in year_in_review_2025.html

Update these sections with new totals:

### Total Stats (~line 450-460)
- Total activities count
- Total miles
- Total hours (moving time / 3600)
- Total elevation (feet)
- Total calories

### Running Stats (~line 490-530)
- Number of runs
- Total running miles
- Total running hours
- Average pace (total_minutes / total_miles, format as MM:SS)
- Total elevation gain

### Walking Stats (~line 540-570)
- Number of walks
- Total walking miles
- Total walking hours

### Hiking Stats (~line 580-610)
- Number of hikes
- Total hiking miles
- Total hiking hours

### Monthly Chart (~line 620-640)
Update the bar heights for each month (values represent miles).

## Step 3: Add New Routes to activities_map.html

### Parse FIT Files for GPS Coordinates

```python
import gzip
from fitparse import FitFile

SEMICIRCLE_TO_DEG = 180.0 / (2**31)

def parse_fit_file(filepath):
    coords = []
    with gzip.open(filepath, 'rb') as f:
        fitfile = FitFile(f)
        for record in fitfile.get_messages('record'):
            lat = lon = None
            for field in record:
                if field.name == 'position_lat' and field.value is not None:
                    lat = field.value * SEMICIRCLE_TO_DEG
                elif field.name == 'position_long' and field.value is not None:
                    lon = field.value * SEMICIRCLE_TO_DEG
            if lat is not None and lon is not None:
                coords.append([lat, lon])
    return coords
```

### Add Polylines to Map

In `activities_map.html`, find the appropriate feature group and add:

```javascript
var poly_line_UNIQUEID = L.polyline(
    [[lat1, lon1], [lat2, lon2], ...],  // coordinates array
    {"color": "#E74C3C", "opacity": 0.8, "weight": 3}  // red for runs
).addTo(feature_group_GROUPID);
```

**Feature Groups:**
- Runs: `feature_group_3e877198026cbd9c9179d21f3aa4f458`
- Hikes: `feature_group_08824e6c0af35c42158f17988c5b8144`
- Walks: `feature_group_29c4835cb463da09f82213030f5adc0a`

**Colors:**
- Runs: `#E74C3C` (red)
- Hikes: `#27AE60` (green)
- Walks: `#3498DB` (blue)

Update the layer counts in the layer control section.

## Step 4: Add Highlight Cards (Optional)

For notable activities, create highlight cards with embedded maps.

### Generate Map with Folium

```python
import folium

coords = parse_fit_file('activity.fit.gz')
center = [sum(c[0] for c in coords)/len(coords),
          sum(c[1] for c in coords)/len(coords)]

m = folium.Map(location=center, zoom_start=13,
               tiles='cartodbpositron',
               zoom_control=False, scrollWheelZoom=False, dragging=False)
folium.PolyLine(coords, color='#E74C3C', weight=3, opacity=0.8).add_to(m)
m.fit_bounds(coords)

html = m._repr_html_()
```

### Card HTML Template

```html
<div class="highlight-card">
    <div class="highlight-badge" style="background: linear-gradient(135deg, #c4756a 0%, #b5635a 100%);">🏃 Badge Text</div>
    <div class="highlight-map">
        <!-- Embed folium map HTML here -->
    </div>
    <div class="highlight-info">
        <h3 class="highlight-title">Activity Name</h3>
        <p class="highlight-date">Month Day, Year</p>
        <div class="highlight-stats">
            <div class="stat">
                <span class="stat-value">X.XX</span>
                <span class="stat-label">Miles</span>
            </div>
            <div class="stat">
                <span class="stat-value">H:MM:SS</span>
                <span class="stat-label">Time</span>
            </div>
            <div class="stat">
                <span class="stat-value">M:SS/mi</span>
                <span class="stat-label">Pace</span>
            </div>
            <div class="stat">
                <span class="stat-value">XXX</span>
                <span class="stat-label">Ft Elev</span>
            </div>
        </div>
    </div>
</div>
```

**Badge Colors:**
- Running: `#c4756a` to `#b5635a`
- Walking: `#7a9bb5` to `#6889a3`
- Hiking: `#8fa882` to `#6d8a60`

## Important Notes

1. **All Strava timestamps are UTC** - Convert to local time if needed
2. **Distance in CSV is kilometers**, not meters
3. **FIT file coordinates use semicircles** - Multiply by `180.0 / (2^31)` for degrees
4. When adding highlight cards, insert in the highlights-grid div in appropriate order

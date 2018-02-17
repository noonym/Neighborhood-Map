## Neighborhood Map

This website shows the neighborhood that I live in and the most 5 known places there.
I used Google Maps API as well as Wikipedia API. I also used `knockoutjs` for the MVVM. The website is responsive and compatible with all devices.

## How To Use The Neighborhood Map

1. Search locations by writing down the location name on the search bar.
1. You can select the desired location be either clicking on its name on the list, or clicking on its marker on the map.
1. An infowindow will appear showing an article from wikipedia about this location.

## How To Host The The Neighborhood Map Website Locally

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to the top-level of the project directory to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ./ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through your browser.
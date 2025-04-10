## Build tools & versions used
SvelteKit@2.20.4 built with Vite@6.2.5
Using ParaglideJS for Internationalization and Tailwind CSS 
Installed and run with pnpm

## Steps to run the app
Run `npm run dev --host` to run the dev server and expose the host for mobile view on port 5173
Run `npm run build` to build the node server into the `/build` dir
Run `npm run preview --host` to run the node server with the build and expose the host for mobile view

## What areas of the app did you focus on?
I focused first on ensuring consistent fetches from the API. 
The load function initially had conflicts with the internationalization routing so I decided to fetch on Mount given the small data size.
This can be used as a fallback for the load function.
The second aspect I focused on was making sure that the internationalization and tailwind setups with Sveltekit worked properly together
Then I focused on building a simple table view, followed by an interactive list view that expands the details of the data on a side panel
The penultimate step was ensuring good responsiveness as well as resizing and mobile layout
The last step was building a simple test and building loading and error components

## What was the reason for your focus? What problems were you trying to solve?
The priority on the data is necessary to ensure the user gets as little errors as possible
The rest was focused on building a fluid, engaging and seamless experience in the app

## How long did you spend on this project?
3 part time days

## Did you make any trade-offs for this project? What would you have done differently with more time?
Yes, with this limited time I wasn't able to test as thoroughly, and build interactive UIs for the errors and delays.
I would also have liked to build interactivity for the table.

## What do you think is the weakest part of your project?
The table view has no interactions and is not well optimized for mobile

## Is there any other information you’d like us to know?
All the libraries installed are from third people, I simply copy pasted the source of my own libraries inside '$lib/components'
Other than that I would like to thank you for this opportunity and hope we get to continue through the next steps. I really enjoyed building 
this little project and I hope it sparks new ideas for your UI.
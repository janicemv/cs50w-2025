## Specifications 
- [X] Your website should have at least three pages: one for regular Google Search (which must be called index.html), one for Google Image Search, and one for Google Advanced Search.
    - [X] On the Google Search page, there should be links in the upper-right of the page to go to Image Search or Advanced Search. On each of the other two pages, there should be a link in the upper-right to go back to Google Search.
- [X] On the Google Search page, the user should be able to type in a query, click “Google Search”, and be taken to the Google search results for that page.
    - [X] Like Google’s own, your search bar should be centered with rounded corners. The search button should also be centered, and should be beneath the search bar.
- [X] On the Google Image Search page, the user should be able to type in a query, click a search button, and be taken to the Google Image search results for that page.
- [X] On the Google Advanced Search page, the user should be able to provide input for the following four fields (taken from Google’s own advanced search options)
    - [X] Find pages with… “all these words:”
    - [X] Find pages with… “this exact word or phrase:”
    - [X] Find pages with… “any of these words:”
    - [X] Find pages with… “none of these words:”
- [X] Like Google’s own Advanced Search page, the four options should be stacked vertically, and all of the text fields should be left aligned.
    - [X] Consistent with Google’s own CSS, the “Advanced Search” button should be blue with white text.
    - [X] When the “Advanced Search” button is clicked, the user should be taken to the search results page for their given query.
- [X] Add an “I’m Feeling Lucky” button to the main Google Search page. Consistent with Google’s own behavior, clicking this link should take users directly to the first Google search result for the query, bypassing the normal results page.
    - [X] You may encounter a redirect notice when using the “I’m Feeling Lucky” button. Not to worry! This is an expected consequence of a security feature implemented by Google.
- [X] The CSS you write should resemble Google’s own aesthetics.

**Hints**

- To determine what the parameter names should be, you’re welcome to experiment with making Google searches, and looking at the resulting URL. It may also be helpful to open the “Network” inspector (accessible in Google Chrome by choosing View -> Developer -> Developer Tools) to view details about requests your browser makes to Google.
- Any `<input>` element (whether its type is text, submit, number, or something else entirely) can have name and value attributes that will become GET parameters when a form is submitted.
- You may also find it helpful to look at Google’s own HTML to answer these questions. In most browsers, you can control-click or right-click on a page and choose “View Page Source” to view the page’s underlying HTML.
- To include an input field in a form that users cannot see or modify, you can use a “hidden” input field.

https://cs50.harvard.edu/web/2020/projects/0/search/
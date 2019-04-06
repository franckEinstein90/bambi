# bambi
Bambi contains several macros and objects to facilitate the management of events in confluence.
- calendar
- timetable
- checklist
- several kinds of event objects. 

bambi can be used as a simple calendar, but it does much more. 

Bambi adds functionality associated with "events". A bambi event is a bundle of information/actions associated with a status of either "ongoing" or "offgoing." Events are flipped when they go from offgoing to ongoing or vice-versa. Triggers for flips can be:

- dates, or 
- date-patterns (every wedneday at 4PM) 
- the completion of one or several Jira tasks, 
- the change in statuses of other events. 

Triggers can also be manual and bambi provides several UI elements that let confluence users flip events directly from a page. 

You can event create even chains or event trees. Each event has an ID, and bambi provides several gadgets to visualize events happening or not. There are the typical tools (calendars, agendas) and less typical ones, such as event flows. 

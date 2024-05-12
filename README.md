# Connect Messenger

[Concept Description](#concept-description) <br>
[Solution Diagram](#solution-diagram) <br>
[Requirements](#requirements) <br>
[User Stories](#user-stories) <br>
[Use Cases](#use-cases) <br>
[Use Case Diagram](#use-case-diagram) <br>
[Entity Relationship Diagram](#entity-relationship-diagram) <br>
[UML Class Diagram](#uml-class-diagram) <br>
[Data Access Layer](#data-access-layer) <br>
[Wireframes](#wireframes) <br>
[Requirements Table](#requirements-table) <br>
 
## Concept Description

This messaging system is designed to meet the communication needs of users.
Communication in our era is taken for granted. This system will be a work in progress to develop a platform that
at the minimum offers the ability to create chats, create groups, manage groups. Initial data is fetched using a API.
Data that is created, modified, or deleted is modified and broadcasted to the appropriate users using a WebSocket server.

## Product Demonstration
<video controls>
  <source src="./videos/FullRecording.mp4" type="video/mp4">
</video>

## Solution Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/SolutionDiagram.png)

# Requirements

## User Stories

<ins>Theme: Login</ins>

1.	As a new user, I want to create an account so that I can start using the application to communicate with colleagues and friends.

    Conditions of satisfaction:
    *	Registration form must include inputs for first name, last name, username, password, and email.
    *	If input validation has passed, the user can now log in using the registered credentials.

2.	As a registered user, I want to be able to reset my password if I forget it so I can continue to communicate with colleagues and friends.

    Conditions of satisfaction:
    *	The forgotten password option must be set with Auth0.

3.	As a registered user, I want to login so I can check for any new messages or send a message to a colleague.

    Conditions of satisfaction:
    *	The login form requires a email and password to authenticate.
    *	Once validated with Auth0, data relevant to the user is fetched and users are redirected to the home page.

<ins>Theme: Messaging</ins>

4.	As a user, I want to send messages to my friends, so that we can have immediate and responsive communication.

    Conditions of satisfaction:
    *	Messages are delivered with low-latency to the recipient.
    *	Both the sender and recipient receive notifications for new messages.
    *	Users can send text messages, emojis, and multimedia content.

5.	As a user, I want to create a group, so that I can collaborate with multiple people in a single chat.

    Conditions of satisfaction:
    *	Users can create a new group and set a group name.
    *	Group creators can add or remove members from the group.
    *	Group members can see the group's chat history.

6.	As a user, I want to be able to search for specific messages and filter messages by user / group.

    Conditions of satisfaction:
    * Users can search for messages within the messaging interface.
    *	Search results are limited to messages where the user is a participant (sender or recipient) to maintain privacy.
    *	The search allows filtering by user, group, or period.
    *	Results are displayed clearly and organized by time received.

<ins> Theme: Functionality </ins>

8.	As a user, I want to be able to pin chats.

    Conditions of satisfaction:
    * Pinned chats must be kept at the top of the chats list.
    *	Pinned chats must not follow sort logic.
    *	Unpinning a chat must restore the chat and insert it into the proper position following the sort order set by the user.
    *	A chat must accurately represent the status of a pin using a visible icon.

9.	As a user, I want to be able to archive chats.

    Conditions of satisfaction:
    * Archived chats should be hidden from the chat log and pushed to the archived chats log.
    *	For one-to-one chats, archived chats must not be permanently deleted until mutual deletion is set by both participants.
    *	For group chats, archived chats must not be permanently deleted until the group creator sets a chat for deletion.
    *	Restoring a chat should remove the chat from the archive log and insert it back into the active chat log, following the set sort order by the user.
    *	A chat must have a visible icon to archive a chat.

## Use Cases

<ins>Use Case 1:	User registration </ins>

Objective: 	Allow new users to create an account and join the messaging platform.

Main Steps:	
1. User visits the site and clicks on the "Log In" button.
2. User is redirected to Auth0 and fills out the registration form with required details (first name, last name, username, password, and email).
3. User submits the registration form to Auth0.
4. The system validates the information and creates a new user account if successful.
5. Upon successful registration, the user can now log in using the registered credentials.

<ins> Use Case 2:	Sending messages </ins>

Objective:  Enable users to send and receive real-time messages.

Main Steps:
1. User logs into the application and is directed to the home page.
3. User selects a chat.
4. User types and sends a message.
5. The socket receives the message, processes the new data, and send back the updated chat to the recipient.
6. Both the sender and recipient receive a visual indicator that a chat is unread indicating a new message.
7. Users can engage in a responsive conversation.

<ins> Use Case 3:	Group Collaboration </ins>

Objective:	Allow users to create and participate in groups.

Main Steps:
1. User logs into the application.
2. User navigates to the "Groups" section.
3. User creates a new group and assigns a group name.
4. User invites other users to join the group.
5. Group members can send messages within the group.
6. Group owners can manage group membership and settings aswell as set a the group for deletion.

<ins> Use Case 4:	Message Search and Filtering </ins>

Objective:	Allow users to search for and filter messages based on specific criteria.

Main Steps:
1. User logs into the application.
2. User navigates to the "Search" feature within the messaging interface.
3. User enters search criteria, such as keywords, usernames, or group names.
4. The system retrieves and displays relevant messages based on the search criteria.
5. Search results are limited to messages in which the user is a participant to ensure privacy.
6. Users can quickly find and review specific messages within their conversation history.

## Use Case Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/UseCaseDiagram.png)

## Entity Relationship Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/ERD.jpg)

## UML Class Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/UML.jpg)


## Data Access Layer

Model <br>
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/data-layer/api-model.png)

Chats <br>
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/data-layer/chats-api.png)

Group Participants <br>
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/data-layer/group-participants-api.png)

Groups <br>
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/data-layer/groups-api.png)

Messages <br>
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/data-layer/messages-api.png)

## Wireframes

### Landing Page
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/Landing_page.jpg)

### Login / Registration (Auth0)
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/Authentication.jpg)

### Chat Interface
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/ChatInterface.jpg)

### Create Chat
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/CreateChat.jpg)

### Group Management
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/GroupManagement.jpg)

### Requirements Table

| ID | Requirement | Testability |
|----|-------------|-------------|
| 1  | The system shall allow new users to create an account and log in using registered credentials. | Yes |
| 2  | The system shall provide a password reset feature for registered users. | Yes |
| 3  | The messaging system shall deliver real-time messages instantly to the recipient. | Yes |
| 4  | Users shall be able to create groups, add/remove members, and view group chat history. | Yes |
| 5  | The search functionality shall allow users to search for users within the messaging interface. | Yes |

[Back to Top](#connect-messenger)


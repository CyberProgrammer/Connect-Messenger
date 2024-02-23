# Connect Messenger

[Concept Description](#concept-description) <br>
[Solution Diagram](#solution-diagram) <br>
[Requirements](#requirements) <br>
[User Stories](#user-stories) <br>
[Use Cases](#use-cases) <br>
[Use Case Diagram](#use-case-diagram) <br>
[Wireframes](#wireframes) <br>
[Requirements Table](#requirements-table) <br>
 
## Concept Description

For this messaging system, I plan on creating a system that meets the communication needs of users. 
Communication in our era is taken for granted. In this system I will develop a platform that 
at the minimum offers user registrations, message posting, and group compositions. 

## Solution Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/SolutionDiagram.png)

# Requirements

## User Stories

<ins>Theme: Login</ins>

1.	As a new user, I want to create an account so that I can start using the application to communicate with colleagues and friends.

    Conditions of satisfaction:
    *	Registration form must include inputs for first name, last name, username, password, email, and phone number.
    *	If input validation passes, a confirmation email will be sent to the user.
    *	The user can now log in using the registered credentials.

2.	As a registered user, I want to be able to reset my password if I forget it so I can continue to communicate with colleagues and friends.

    Conditions of satisfaction:
    *	The forgotten password form must include an input for the email associated with the user’s account.
    *	Once validated, the user will receive a password reset link via email or SMS.
    *	Password reset links are time limited for security.
    *	Users can set a new password once the link has been accessed within the time limit. 

3.	As a registered user, I want to login so I can check for any new messages or send a message to a colleague.

    Conditions of satisfaction:
    *	The login form requires only a username and password.
    *	Once validated, users are redirected to their home page.

<ins>Theme: Messaging</ins>

4.	As a user, I want to send real-time messages to my friends, so that we can have immediate and responsive communication.

    Conditions of satisfaction:
    *	Messages are delivered instantly to the recipient.
    *	Both the sender and recipient receive real-time notifications for new messages.
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

<ins>Theme: Security</ins>

7.	As a user, I want to ensure the security of my account, so that my personal information and messages are protected.

    Conditions of satisfaction:
    *	Passwords must be securely hashed and stored.
    *	Users should have the option to enable two-factor authentication during registration or later in the account settings.
    *	Users can change their password and manage security settings.

## Use Cases

<ins>Use Case 1:	User registration </ins>

Objective: 	Allow new users to create an account and join the messaging platform.

Main Steps:	
1. User visits the site and clicks on the "Get Started" button.
2. User fills out the registration form with required details (first name, last name, username, password, email, and phone number)
3. User submits the registration form.
4. The system validates the information and creates a new user account if successful.
5. Upon successful registration, the user receives a confirmation email or notification.
6. The user can now log in using the registered credentials.

<ins> Use Case 2:	Sending messages </ins>

Objective:  Enable users to send and receive real-time messages.

Main Steps:
1. User logs into the application.
2. User navigates to the chat interface.
3. User selects a contact or group to send a message.
4. User types and sends a real-time message.
5. The system delivers the message instantly to the recipient.
6. Both the sender and recipient receive real-time notifications for new messages.
7. Users can engage in an immediate and responsive conversation.

<ins> Use Case 3:	Group Collaboration </ins>

Objective:	Allow users to create and participate in groups.

Main Steps:
1. User logs into the application.
2. User navigates to the "Groups" section.
3. User creates a new group and assigns a group name.
4. User invites other users to join the group.
5. Group members can send real-time messages within the group.
6. Group owners can manage group membership and settings.

<ins> Use Case 4:	Password Reset </ins>

Objective:	Enable registered users to reset their passwords if forgotten.

Main Steps:
1. User attempts to log in but forgets their password.
2. User clicks on the "Forgot Password" link on the login screen.
3. User enters the registered email address.
4. The system sends a password reset link to the user's email.
5. User clicks on the reset link and sets a new password.
6. The new password is validated and saved in the system.
7. The user can now log in using the updated credentials.

<ins> Use Case 5	Message Search and Filtering </ins>

Objective:	Allow users to search for and filter messages based on specific criteria.

Main Steps:
1. User logs into the application.
2. User navigates to the "Search" or "Filter" feature within the messaging interface.
3. User enters search criteria, such as keywords, usernames, or group names.
4. The system retrieves and displays relevant messages based on the search criteria.
5. Search results are limited to messages in which the user is a participant to ensure privacy.
6. Users can quickly find and review specific messages within their conversation history.

## Use Case Diagram

![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/UseCaseDiagram.png)

## Wireframes

### Registration
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/Registration.jpg)

### Login
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/Login.jpg)

### Password Reset
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/PasswordReset.jpg)

### Chat Interface
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/ChatInterface.jpg)

### Create Chat
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/CreateChat.jpg)

### Group Management
![image link](https://github.com/CyberProgrammer/Connect-Messenger/blob/master/images/Wireframes/GroupManagement.jpg)

## Requirements Table

| ID | Requirement | Testability |
|----|-------------|-------------|
| 1  | The system shall allow new users to create an account and log in using registered credentials. | Yes |
| 2  | The system shall provide a password reset feature for registered users. | Yes |
| 3  | The messaging system shall deliver real-time messages instantly to the recipient. | Yes |
| 4  | Users shall be able to create groups, add/remove members, and view group chat history. | Yes |
| 5  | The search functionality shall allow users to search for users within the messaging interface. | Yes |

[Back to Top](#connect-messenger)


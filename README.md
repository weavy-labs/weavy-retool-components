# Weavy Retool components

## Custom component library template

This is a custom component library for projects within [Retool](https://www.retool.com).

To learn more about how custom component libraries work, visit the [official documentation](https://docs.retool.com/apps/web/guides/components/develop-custom-components/custom-components-beta).

**You need to register these components in your account to be able to use them.**

### Install

To be able to use and publish the components, you need to install the dependencies.

```bash
npm install
```

### Sign in to Retool

To use the Retool utils for development and publishing, first sign into your Retool account. You will need [admin permissions](https://docs.retool.com/org-users/concepts/permission-groups#default-permission-groups) in Retool.
You will also need an API key. See [Retool API authentication documentation](https://docs.retool.com/org-users/guides/retool-api/authentication#create-an-access-token).

```bash
npx run login
```

### Configure Weavy

For the configuration scripts to work, you need to provide a `WEAVY_URL`and `WEAVY_APIKEY` environment variable.
These can be defined in an `.env` file in the root of the project (see [.env.example](./.env.example)).

```ini
# .env
WEAVY_URL="https:example.weavy.io" # Your Weavy environment URL
WEAVY_APIKEY="wys_*********" # Your secret API key.
```

## Demo app

There is a full Retool app example with integrated Weavy components. You can create the Weavy components and upload the demo app to your Retool account with the following command.

```bash
npm run create:demo
```

## Weavy components

The queries will provide your apps and components with user tokens for Weavy authentication. You can set up everything with one command.

> If you already have created the demo app, this is already done.

```bash
npm run create:weavy
```

### Using configuration variables

We strongly recommend you to use [configuration variables](https://docs.retool.com/org-users/guides/config-vars) in Retool to store the Weavy configuration.

You can init the components with configuration variables instead.

```bash
npm run create:weavy-pro
```

> Note: *Configuration variables* are **not** available in the Retool *Free* plan.

### Use the workflow in an app query

To activate and use the authentication workflow within your Retool app, you need to add a query that is using the workflow.

- Open your Retool app editor and go to the **<> Code** panel.
- Click on **＋ Add query** and choose **Import Workflow**.
- Name the query `getWeavyToken`.
- Select **Workflow** and choose **WeavyRetoolWorkflow**.
  
  The Workflow parameters should be defaulted with the data shown below. Otherwise you can set it as *raw* data.

  ```json
  { 
    "uid" : {{ current_user.sid }}, 
    "fullname" : {{ current_user.fullName }}, 
    "email" : {{ current_user.email }}, 
    "avatar" : {{ current_user.profilePhotoUrl }}
  }
  ```

- **Save** the query and give it a **run** to try it out!

### Using weavy components

Drag'n'drop components into your app. You may have to configure `uid` and `displayName` on any contextual components. The components follow your theme settings, but you may also override any theme settings.

### Setting up notification events

Drag the **Weavy Notification Events** component into you app. The component must be present all the time to work.

#### Configure notification toasts

* Add an *Event handler* for the `Notification` event. 
  - Set the event to **Show notification**.
  - Set the *Title* to `{{ self.notificationTitle }}`
  - Set the *Description* to `{{ self.notificationDescription }}`.

#### Configure token refreshing

Since the notification events is always present it's suitable for handling refreshing of user tokens when needed.

* Set an *Event handler* for the `Refresh token` event.
  - Set the event to **Control query**.
  - Select the `getWeavyToken` query.
  - Set the *Method* to **Trigger**.

#### Set up a button with badge for unread notifications

You can connect the `notificationCount` property of the *Weavy Notification Events* component with a badge.

* Add a *Button group* component. This is very suitable for displaying unread notifications.
  - Add a button with any desired icon.
  - Set the label to `{{ String(weavyNotificationEvents1.notificationCount || '') }}` (assuming your notification component is called *weavyNotificationEvents1*). The label will be automatically hidden when the count is `0`.

### Setting up Notifications

Add the *Weavy Notifications* component to your app.

#### Configure navigation

To set up navigation when clicking notification items in the Notifications component, you must first [Customize app URLs](https://docs.retool.com/apps/guides/customization/customize-app-urls) in *App settings* > *Page settings* your Retool app, to be able to use deep links. This can be a bit challenging if you haven't done it before. Make sure there is a way to navigate to all the places where you are using Weavy components. Once this is done, the Weavy components will automatically encode these page variables into their own *uid*.

* Add an *Event handler* for the `Navigate` event.
  - Set the event to **Run script**.
  - Set the script to
    ```js
    utils.openApp(weavyNotifications1.navigateAppUuid, weavyNotifications1.navigateParams)
    ```
* Optionally any additional *Event handler* for the `Navigate` event to do additional things upon navigation, such as closing a *Drawer* for instance.

## Customization

You can customize the components anyway you like.

### Develop

Modify any components and update them in your Retool account.

```bash
npm run dev
```

### Deploy

Deploy any finished components in your Retool account.

```bash
npm run deploy
```

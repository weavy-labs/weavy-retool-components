## Custom component libraries template

Use this as a base for new custom component library projects within [Retool](https://www.retool.com).

To learn more about how custom component libraries work, visit our [official documentation](https://docs.retool.com/apps/web/guides/components/develop-custom-components/custom-components-beta).

**You need to register these components in your account to be able to use them.**

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

## Weavy components

### Configure Weavy

Set up two configuration variables for environment url and Api key in you [Settings > Configuration variables](https://docs.retool.com/org-users/guides/config-vars#create-configuration-variables). You may specify different environment/api key for staging and production.

* WEAVY_URL: *Your Environment URL*
* WEAVY_APIKEY: *Your wys_*** API key **Note: this should be set as secret**.

### Set up queries

The queries will provide your components with user tokens and a weavy configuration.

#### getWeavyToken()

Yadayada `WeavyRetoolWorkFlow`.

* Name the query `getWeavyToken`.

#### getWeavyConfig()

Create a JS function query. The function may only return JSON compatible data (only strings/numbers/booleans and no functions/instances).

```js
return {
  url: retoolContext.configVars.WEAVY_URL
}
```

* Name the query `getWeavyConfig`.

### Using weavy components

Drag'n'drop components into your app. You may have to configure `uid` on any contextual components. The components follow your theme settings, but you may also override any theme settings.

### Setting up notification events

Drag the **Weavy Notification Events** component into you app. The component must be present all the time to work.

#### Configure notification toasts

* Add an *Event handler* for the `Notification` event. 
  - Set the event to **Show notification**.
  - Set the Title to `{{ self.notificationTitle }}`
  - Set the description to `{{ self.notificationTitle }}`.

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

* Add an *Event handler* for the `Navigation` event.
  - Set the event to **Run script**.
  - Set the script to
    ```js
    utils.openApp(retoolContext.appUuid, weavyNotifications1.navigationParams)
    ```
* Optionally any additional *Event handler* for the `Navigation` event to do additional things upon navigation, such as closing a *Drawer* for instance.
* Add an *Event handler for the `Open messenger` event.
 - Set the event to do whatever you need to show the messenger, such as opening a drawer.
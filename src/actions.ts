export class UIActions {
    public AddMessage = 'fake action to add a message to the UI console';
    public Reset= 'fake action to reset the UI to fresh state';
    public AddPropertiesPane = 'adds a contextual pane displaying the properties of the selected UI element';
    public RemovePropertiesPane = 'closes the contextual pane';
    public UpdateContext = 'updates the contextual element that has UI focus';
    public LoadMainPane = 'Loads the main pane with content';
    public AddErrorMessage = 'Normally this would be AddMessage with a different payload';
}

export class UserActions {
    public SignIn = 'Sign in a user account';
    public SignOut = 'sign out of the current user account';
}

export class MenuActions {
    public LoadFile = 'Load a file to display in the application';
}
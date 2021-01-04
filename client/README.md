# Sample APIs - React Application

## Generate new templates

We are utilizing [Generate React CLI](https://github.com/arminbro/generate-react-cli) to help stream line and standardize the process of creating new components for our application.

We can customized the outputs to fit this applications needs and have expanded the definition of types. Below are a list of commands you can use to create new components, pages, layouts, or hooks.

### Component

By default, we are creating components. Simply run this command and let the CLI take care of the rest.

```JavaScript
npx generate-react-cli component [NAME]
```

* Replace `[NAME]` with the desired name.

### Page

When generating a new page, you run the same command but with a `--type` flag of page.

```JavaScript
npx generate-react-cli component [NAME] --type=page
```

* Replace `[NAME]` with the desired name.

### Layout

When generating a new layout, you run the same command but with a `--type` flag of layout.

```JavaScript
npx generate-react-cli component [NAME] --type=layout
```

* Replace `[NAME]` with the desired name.

### Hooks

Just like everything else, hooks have some boiler plate code as well. To create a new hook, simply the add the `--type` flag of hook/

```JavaScript
npx generate-react-cli component [NAME] --type=hook
```

* Replace `[NAME]` with the desired name.

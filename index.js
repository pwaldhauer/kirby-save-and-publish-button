const addButtonToDom = () => {
    // Only add it for pages for now
    if (panel.$view.path.indexOf('pages') !== 0) {
        return;
    }

    // Button already exists
    if(document.querySelector('[data-save-and-publish-button]')) {
        return;
    }

    const buttons = document.querySelector('.k-header-buttons .k-button-group');

    const template = `
        <button 
            data-save-and-publish-button
            data-has-icon="true" 
            data-has-text="true" 
            data-responsive="true" 
            data-size="sm" 
            data-theme="positive" 
            data-variant="filled" 
            type="button" 
            class="k-button k-page-view-status k-status-icon" 
            style="--icon-size: 15px;"
           >
            <span class="k-button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="k-icon" style="fill: black !important;"><path d="M9 7.53861L15 21.5386L18.6594 13H23V11H17.3406L15 16.4614L9 2.46143L5.3406 11H1V13H6.6594L9 7.53861Z"></path></svg>
            </span>
            <span class="k-button-text"> Save & Publish </span>
          </button>
    `

    const button = document.createElement('button');
    button.innerHTML = template;

    button.addEventListener('click', async () => {
        await panel.$vue.$store.dispatch("content/save");
        panel.$vue.$events.emit("model.update");
        panel.notification.success();

        await panel.$api.pages.changeStatus(panel.$view.path.replace('pages/', ''), 'listed', 0)
        panel.$vue.$reload({ silent: true });
    });

    buttons.appendChild(button);
}

history.pushState = function () {
    addButtonToDom();
    History.prototype.pushState.apply(history, arguments);
}

window.onload = function () {
    addButtonToDom();
}
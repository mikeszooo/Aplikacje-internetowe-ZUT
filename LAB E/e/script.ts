const msg: string = "Hello!";

alert(msg);

function changeStyle(stylePath: string): void {
    const link = document.getElementById('dynamic-style') as HTMLLinkElement;
    if (link) {
        link.href = stylePath;
    }
}

const styles = {
    ciemny: 'css/page1.css',
    jasny: 'css/page2.css',
    trzeci: 'css/page3.css',
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('style-links');
    if (container) {
        Object.keys(styles).forEach((styleName) => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = `Zmień na motyw ${styleName} `;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                changeStyle(styles[styleName as keyof typeof styles]);
            });
            container.appendChild(link);
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(['apiUrl', 'apiKey'], async function(storage) {
    fetch(`${storage.apiUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-N8N-API-KEY': storage.apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
    const workflows = data.data;
    const container = document.getElementById('workflows');
    const structure = {};

    workflows.forEach(workflow => {
      const parts = workflow.name.split('_');
      let currentLevel = structure;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          currentLevel[part] = { id: workflow.id, active: workflow.active };
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          currentLevel = currentLevel[part];
        }
      });
    });

    function createDetails(name, content, level = 0) {
      if (typeof content === 'object' && content.id !== undefined) {
        const a = document.createElement('a');
        a.href = `https://n8n.gravitasdocs.com/workflow/${content.id}`;
        a.textContent = name;
        a.target = '_blank';
        const span = document.createElement('span');
        span.style.width = '10px';
        span.style.height = '10px';
        span.style.backgroundColor = content.active ? 'green' : 'red';
        span.style.display = 'inline-block';
        span.style.borderRadius = '50%';
        span.style.marginLeft = '5px';
        a.appendChild(span);
        a.style.paddingLeft = `${level * 10}px`;
        a.style.paddingTop = '2px';
        a.style.paddingBottom = '2px';
        a.style.display = 'block';
        return a;
      } else {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = name;
        details.appendChild(summary);
        details.style.paddingLeft = `${level * 10}px`;
        details.style.paddingTop = '2px';
        details.style.paddingBottom = '2px';
        const keys = Object.keys(content).sort();
        keys.forEach(key => {
          details.appendChild(createDetails(key, content[key], level + 1));
        });
        return details;
      }
    }

    const keys = Object.keys(structure).sort();
    keys.forEach(key => {
      container.appendChild(createDetails(key, structure[key]));
    });
  })
  .catch(error => console.error('Error:', error));
});
  });
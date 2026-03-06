/**
 * CollapsibleSection - 可展开/收起的区块组件
 * 支持 Internships 和 Projects 模块的交互功能
 */

class CollapsibleSection {
  constructor(options) {
    this.container = options.container;
    this.title = options.title;
    this.icon = options.icon || '';
    this.content = options.content;
    this.isExpanded = options.defaultExpanded !== false;
    this.onToggle = options.onToggle || (() => {});
    
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    if (this.isExpanded) {
      this.expand(false);
    } else {
      this.collapse(false);
    }
  }

  render() {
    const section = document.createElement('div');
    section.className = 'collapsible-section';
    section.innerHTML = `
      <div class="collapsible-header" role="button" tabindex="0" aria-expanded="${this.isExpanded}">
        <div class="collapsible-title-wrapper">
          <span class="collapsible-icon">${this.icon}</span>
          <h3 class="collapsible-title">${this.title}</h3>
        </div>
        <div class="collapsible-arrow-wrapper">
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="collapsible-content-wrapper">
        <div class="collapsible-content">
          ${this.content}
        </div>
      </div>
    `;
    
    this.element = section;
    this.header = section.querySelector('.collapsible-header');
    this.arrow = section.querySelector('.collapsible-arrow');
    this.contentWrapper = section.querySelector('.collapsible-content-wrapper');
    this.contentEl = section.querySelector('.collapsible-content');
  }

  attachEvents() {
    // 点击事件
    this.header.addEventListener('click', () => this.toggle());
    
    // 键盘事件（可访问性）
    this.header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle(animate = true) {
    if (this.isExpanded) {
      this.collapse(animate);
    } else {
      this.expand(animate);
    }
    this.onToggle(this.isExpanded);
  }

  expand(animate = true) {
    this.isExpanded = true;
    this.header.setAttribute('aria-expanded', 'true');
    this.arrow.style.transform = 'rotate(180deg)';
    
    if (animate) {
      this.contentWrapper.style.height = this.contentEl.scrollHeight + 'px';
      this.contentWrapper.style.opacity = '1';
      
      setTimeout(() => {
        this.contentWrapper.style.height = 'auto';
      }, 300);
    } else {
      this.contentWrapper.style.height = 'auto';
      this.contentWrapper.style.opacity = '1';
    }
  }

  collapse(animate = true) {
    this.isExpanded = false;
    this.header.setAttribute('aria-expanded', 'false');
    this.arrow.style.transform = 'rotate(0deg)';
    
    if (animate) {
      const height = this.contentEl.scrollHeight;
      this.contentWrapper.style.height = height + 'px';
      
      // 强制重绘
      this.contentWrapper.offsetHeight;
      
      this.contentWrapper.style.height = '0px';
      this.contentWrapper.style.opacity = '0';
    } else {
      this.contentWrapper.style.height = '0px';
      this.contentWrapper.style.opacity = '0';
    }
  }

  mount(parent) {
    parent.appendChild(this.element);
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// 将 Internships 卡片转换为时间轴 HTML
function convertInternshipsToTimeline(cardsContainer) {
  const cards = cardsContainer.querySelectorAll('.exp-card');
  let timelineHTML = '<div class="intern-timeline">';
  
  cards.forEach((card, index) => {
    const company = card.querySelector('.exp-company')?.textContent || '';
    const position = card.querySelector('.exp-position')?.textContent || '';
    const duration = card.querySelector('.exp-duration')?.textContent || '';
    const highlights = card.querySelectorAll('.exp-highlights li');
    
    const isLast = index === cards.length - 1;
    
    timelineHTML += `
      <div class="intern-timeline-item">
        <div class="intern-timeline-marker">
          <div class="intern-timeline-dot"></div>
          ${!isLast ? '<div class="intern-timeline-line"></div>' : ''}
        </div>
        <div class="glass-card intern-timeline-card">
          <div class="intern-timeline-header">
            <div class="intern-timeline-info">
              <div class="intern-timeline-title-row">
                <h4 class="intern-company">${company}</h4>
                <span class="intern-duration">${duration}</span>
              </div>
              <p class="intern-position">${position}</p>
            </div>
          </div>
          <ul class="intern-highlights">
            ${Array.from(highlights).map(li => `<li>${li.textContent}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  });
  
  timelineHTML += '</div>';
  return timelineHTML;
}

// 初始化所有可展开区块
function initCollapsibleSections() {
  // 找到 Experiences 区域
  const experiencesSection = document.querySelector('#experience');
  if (!experiencesSection) return;

  // 找到 Internships 和 Projects 区域（前两个 exp-section）
  const expSections = experiencesSection.querySelectorAll('.exp-section');
  
  expSections.forEach((section, index) => {
    const titleEl = section.querySelector('.exp-section-title');
    const contentEl = section.querySelector('.exp-cards');
    
    if (!titleEl || !contentEl) return;
    
    // 只处理 Internships 和 Projects（前两个）
    if (index >= 2) return;
    
    const title = titleEl.textContent.trim();
    const icon = titleEl.querySelector('.exp-icon')?.textContent || '';
    
    // Internships 不转换为可展开区块，只转换内容布局
    if (title.includes('Internships')) {
      // 转换内容布局为时间轴
      const timelineHTML = convertInternshipsToTimeline(contentEl);
      // 替换原内容
      contentEl.outerHTML = timelineHTML;
      // 不删除标题，保持原有样式
      return;
    }
    
    // Projects 保持原有卡片布局，使用可展开区块
    let contentHTML = contentEl.outerHTML;
    contentHTML = contentHTML.replace(/class="exp-highlights"/g, 'class="exp-highlights" style="line-height: 1.2;"');
    
    // 创建可展开区块
    const collapsible = new CollapsibleSection({
      container: section,
      title: title.replace(icon, '').trim(),
      icon: icon,
      content: contentHTML,
      defaultExpanded: false, // Projects 默认收起
      onToggle: (isExpanded) => {
        console.log(`${title} is now ${isExpanded ? 'expanded' : 'collapsed'}`);
      }
    });
    
    // 清空原内容并挂载新组件
    contentEl.remove();
    titleEl.remove();
    collapsible.mount(section);
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initCollapsibleSections);

// 导出组件供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CollapsibleSection, initCollapsibleSections };
}

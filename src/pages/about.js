export function renderAbout() {
  const page = document.createElement('div');
  page.className = 'about-page';

  page.innerHTML = `
    <!-- Hero -->
    <section class="about-hero">
      <div class="container about-hero__inner">
        <h1 class="about-hero__title">О TechStore</h1>
        <p class="about-hero__subtitle">Ваш надёжный магазин премиальной электроники и передовых технологий</p>
      </div>
    </section>

    <div class="container about-body">

      <!-- Наша история -->
      <section class="about-section about-story">
        <div class="about-story__text">
          <h2 class="about-section__title">Наша история</h2>
          <p class="about-story__para">
            Основанный в 2020 году, TechStore стал одним из самых надёжных магазинов
            потребительской электроники. Мы увлечены тем, чтобы предлагать вам новейшие
            и лучшие технологические продукты по конкурентным ценам.
          </p>
          <p class="about-story__para">
            Наша миссия проста: обеспечивать исключительные товары, превосходное
            обслуживание клиентов и удобный процесс покупок. Независимо от того,
            являетесь ли вы технологическим энтузиастом или просто ищете надёжную
            электронику — мы поможем найти именно то, что вам нужно.
          </p>
          <p class="about-story__para">
            Благодаря тщательно подобранному ассортименту премиальных брендов мы
            гарантируем, что каждый товар в нашем каталоге соответствует высоким
            стандартам качества и производительности.
          </p>
        </div>
        <div class="about-story__img-wrap">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80"
            alt="TechStore team"
            class="about-story__img"
          />
        </div>
      </section>

      <!-- Наши ценности -->
      <section class="about-section about-values">
        <h2 class="about-section__title about-section__title--center">Наши ценности</h2>
        <div class="about-values__grid">
          <div class="value-card">
            <span class="value-card__icon">🎯</span>
            <h3 class="value-card__title">Качество прежде всего</h3>
            <p class="value-card__desc">
              Мы продаём только товары от проверенных брендов, которые соответствуют
              нашим строгим стандартам качества.
            </p>
          </div>
          <div class="value-card">
            <span class="value-card__icon">💯</span>
            <h3 class="value-card__title">Довольный покупатель</h3>
            <p class="value-card__desc">
              Ваше счастье — наш приоритет. Мы стремимся обеспечить исключительный
              сервис на каждом этапе покупки.
            </p>
          </div>
          <div class="value-card">
            <span class="value-card__icon">⚡</span>
            <h3 class="value-card__title">Быстро и надёжно</h3>
            <p class="value-card__desc">
              Быстрая доставка, простой возврат и отзывчивая поддержка —
              мы рядом, когда вы в нас нуждаетесь.
            </p>
          </div>
        </div>
      </section>

      <!-- Контакты -->
      <section class="about-section about-contacts">
        <h2 class="about-section__title about-section__title--center">Свяжитесь с нами</h2>
        <div class="about-contacts__grid">

          <div class="contact-card">
            <div class="contact-card__icon-wrap contact-card__icon-wrap--blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 class="contact-card__title">Напишите нам</h3>
            <p class="contact-card__line">support@techstore.com</p>
            <p class="contact-card__line">sales@techstore.com</p>
          </div>

          <div class="contact-card">
            <div class="contact-card__icon-wrap contact-card__icon-wrap--green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
            </div>
            <h3 class="contact-card__title">Позвоните нам</h3>
            <p class="contact-card__line">TECH-SHOP</p>
            <p class="contact-card__line">(+375-29-846-32-01)</p>
          </div>

          <div class="contact-card">
            <div class="contact-card__icon-wrap contact-card__icon-wrap--purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 class="contact-card__title">Наш адрес</h3>
            <p class="contact-card__line">23-00-28</p>
            <p class="contact-card__line">Гродно, ул. Ожешко 22</p>
          </div>

          <div class="contact-card">
            <div class="contact-card__icon-wrap contact-card__icon-wrap--orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="contact-card__title">Часы работы</h3>
            <p class="contact-card__line">Пн–Пт: 9:00 – 18:00</p>
            <p class="contact-card__line">Сб–Вс: 10:00 – 16:00</p>
          </div>

        </div>
      </section>

    </div>
  `;

  return page;
}

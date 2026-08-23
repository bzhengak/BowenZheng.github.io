import { useI18n } from '../../i18n/I18nProvider';
import { useReveal } from '../../hooks/useReveal';

export function FooterCta() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  return (
    <footer className="reveal" ref={ref} aria-label="Contact">
      <div className="footer-cta">
        <div className="footer-kicker">{t('footer_kicker')}</div>
        <h2 className="footer-title">{t('footer_title')}</h2>
        <p className="footer-sub">{t('footer_sub')}</p>

        <div className="footer-actions">
          <a href="mailto:bowen.zheng.owen@gmail.com" className="cta-btn cta-btn--primary">
            <i className="ri-mail-line" aria-hidden="true" />
            bowen.zheng.owen@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/bowen-zheng-owen"
            target="_blank"
            rel="noreferrer noopener"
            className="cta-btn cta-btn--ghost"
          >
            <i className="ri-linkedin-box-line" aria-hidden="true" />
            {t('cta_linkedin')}
          </a>
          <a
            href="https://github.com/bzhengak/BowenZheng.github.io"
            target="_blank"
            rel="noreferrer noopener"
            className="cta-btn cta-btn--ghost"
          >
            <i className="ri-github-line" aria-hidden="true" />
            {t('cta_github')}
          </a>
        </div>

        <div className="footer-meta">
          <span>{t('footer_rights')}</span>
          <span>{t('footer_built')}</span>
        </div>
      </div>
    </footer>
  );
}

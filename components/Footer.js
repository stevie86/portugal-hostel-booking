'use client'

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('brand')}</h3>
            <p className="text-neutral-text-muted">
              {t('description')}
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-text-muted hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link href="/properties" className="text-neutral-text-muted hover:text-white transition-colors">{t('properties')}</Link></li>
              <li><Link href="/about" className="text-neutral-text-muted hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href="/contact" className="text-neutral-text-muted hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">{t('destinations')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('lisbon')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('porto')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('algarve')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('coimbra')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">{t('support')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('helpCenter')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('termsOfService')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('privacyPolicy')}</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">{t('faq')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-800 mt-8 pt-8 text-center">
          <p className="text-neutral-text-muted">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
import { useEffect } from 'react';
import { site } from '../data/site';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : `${site.name}: Learn AI, level up`;
  }, [title]);
}

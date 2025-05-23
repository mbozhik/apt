import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Studio')
    .items([S.documentTypeListItem('tire').title('Шины'), 
            S.documentTypeListItem('collection').title('Коллекции')])

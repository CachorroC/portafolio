export const dateToFormatedString = ( rawDate?: string | Date | null | undefined, ) => {
  if ( !rawDate || rawDate === null || rawDate === undefined ) {
    return 'sin especificar';
  }

  // Changed timeZone from 'UTC' to 'America/Bogota'
  if ( typeof rawDate === 'string' ) {
    return new Date( rawDate )
      .toLocaleString(
        'es-CO', {
          timeZone: 'America/Bogota',
          year    : 'numeric',
          weekday : 'short',
          month   : 'long',
          day     : 'numeric',
        } 
      );
  }

  // Changed timeZone from 'UTC' to 'America/Bogota'
  return rawDate.toLocaleString(
    'es-CO', {
      timeZone: 'America/Bogota',
      year    : 'numeric',
      weekday : 'short',
      month   : 'long',
      day     : 'numeric',
    } 
  );
};

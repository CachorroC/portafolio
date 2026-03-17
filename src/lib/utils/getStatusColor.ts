
// Optional: A helper function to color-code the conservation status chip
const getStatusColor = ( status: string | null ) => {
  if ( !status ) {
    return 'default';
  }

  if ( status.includes( 'Vulnerable' ) || status.includes( 'Near Threatened' ) ) {
    return 'warning';
  }

  if ( status.includes( 'Endangered' ) || status.includes( 'Extinct' ) ) {
    return 'error';
  }

  if ( status.includes( 'Least Concern' ) ) {
    return 'success';
  }

  return 'default';
};

export default getStatusColor;
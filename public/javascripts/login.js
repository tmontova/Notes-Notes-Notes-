/*
 * Author : Timm Allman
 */

$( function () {
	if( '#login' ){
		$( '#signup-email, #login-email' ).on( 'change', function ( e ) {
			if ( !emailRegex.test( this.value ) && $( this.parentElement ).children( '.form-error' ).length === 0 ) {
				$( this.parentElement ).append( '<div class="form-error">Please provide a valid email address.</div>' );
			}

			if ( $( this ).siblings( '.form-error' ).length > 0 && emailRegex.test( this.value ) ) {
				$( this ).siblings( '.form-error' ).remove();
			}
		} );

		$( '#confirm-password' ).on( 'change', function ( e ) {
			if ( this.value !== $( '#signup-password' ).val() ) {
				$( this.parentElement ).append( '<div class="form-error">Password and Comfirmation Password must match.</div>' );
				$( '#signup-password' ).on( 'change', function ( e ) {
					if ( this.value === $( '#confirm-password' ).val() ) {
						$( '#confirm-password' ).siblings( '.form-error' ).remove();
					}
				} );
			}

			if ( $( this ).siblings( '.form-error' ).length > 0 && this.value === $( '#signup-password' ).val() ) {
				$( this ).siblings( '.form-error' ).remove();
				$( '#signup-password' ).off( 'change' );
			}
		} );
	}
} );
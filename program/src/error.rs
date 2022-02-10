use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Debug, Error, Copy, Clone)]
pub enum VotingError {
    #[error("Unavailable option")]
    UnavailableOption,
}

impl From<VotingError> for ProgramError {
    fn from(e: VotingError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

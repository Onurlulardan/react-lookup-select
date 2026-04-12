import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import { Pagination } from '../Pagination';

const defaultProps = {
  currentPage: 1,
  totalCount: 50,
  pageSize: 10,
  onPageChange: vi.fn(),
};

describe('Pagination', () => {
  it('returns null when there is only 1 page', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalCount={10} pageSize={10} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null when totalCount is 0', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalCount={0} pageSize={10} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page numbers correctly for a small range', () => {
    render(
      <Pagination {...defaultProps} totalCount={30} pageSize={10} currentPage={1} />
    );
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination {...defaultProps} totalCount={100} pageSize={10} currentPage={5} />
    );
    const dots = document.querySelectorAll('.lookup-select__pagination-dots');
    expect(dots.length).toBeGreaterThanOrEqual(1);
    expect(dots[0].textContent).toBe('...');
  });

  it('shows ellipsis on both sides when current page is in the middle', () => {
    render(
      <Pagination {...defaultProps} totalCount={200} pageSize={10} currentPage={10} />
    );
    const dots = document.querySelectorAll('.lookup-select__pagination-dots');
    expect(dots.length).toBe(2);
  });

  it('disables the previous button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(
      <Pagination {...defaultProps} totalCount={50} pageSize={10} currentPage={5} />
    );
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('enables previous button when not on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).not.toBeDisabled();
  });

  it('enables next button when not on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with the correct page when a page number is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} onPageChange={onPageChange} currentPage={1} />
    );
    fireEvent.click(screen.getByLabelText('Page 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when previous button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} onPageChange={onPageChange} currentPage={3} />
    );
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when next button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} onPageChange={onPageChange} currentPage={3} />
    );
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('shows correct records info for the first page', () => {
    render(
      <Pagination {...defaultProps} totalCount={50} pageSize={10} currentPage={1} />
    );
    expect(screen.getByText('1-10 / 50 records')).toBeInTheDocument();
  });

  it('shows correct records info for a middle page', () => {
    render(
      <Pagination {...defaultProps} totalCount={50} pageSize={10} currentPage={3} />
    );
    expect(screen.getByText('21-30 / 50 records')).toBeInTheDocument();
  });

  it('shows correct records info for the last page with partial results', () => {
    render(
      <Pagination {...defaultProps} totalCount={45} pageSize={10} currentPage={5} />
    );
    expect(screen.getByText('41-45 / 45 records')).toBeInTheDocument();
  });

  it('uses i18n labels when provided', () => {
    const i18n = {
      previousPage: 'Onceki sayfa',
      nextPage: 'Sonraki sayfa',
      pageLabel: (pageNum: number) => `Sayfa ${pageNum}`,
      recordsInfo: (start: number, end: number, total: number) =>
        `${start}-${end} / ${total} kayit`,
    };

    render(
      <Pagination
        {...defaultProps}
        totalCount={50}
        pageSize={10}
        currentPage={2}
        i18n={i18n}
      />
    );

    expect(screen.getByLabelText('Onceki sayfa')).toBeInTheDocument();
    expect(screen.getByLabelText('Sonraki sayfa')).toBeInTheDocument();
    expect(screen.getByLabelText('Sayfa 1')).toBeInTheDocument();
    expect(screen.getByText('11-20 / 50 kayit')).toBeInTheDocument();
  });

  it('marks the current page button as active with aria-current', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const activeButton = screen.getByLabelText('Page 2');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination {...defaultProps} className="custom-class" />
    );
    const paginationDiv = container.firstChild as HTMLElement;
    expect(paginationDiv.className).toContain('custom-class');
  });
});
